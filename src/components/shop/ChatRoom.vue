<template>
    <div>
        <!-- 聊天按鈕 -->
        <button v-if="isHideChat" class="chat-button btn btn-primary" @click="isOpen = true">
            <i class="bi bi-chat-dots" style="font-size: 2rem;"></i>
        </button>

        <!-- 聊天室 -->
        <div v-if="isShowChat" class="chat-container">
            <!-- 標題列 -->
            <div class="chat-header">
                <span class="ms-2">聊天室</span>
                <button class="btn btn-light btn-sm" @click="isOpen = false">
                    <i class="bi bi-chevron-down"></i>
                </button>
            </div>

            <div class="chat-content">
                <!-- 聊天對象列表 -->
                <div class="chat-list">
                    <div v-for="user in users" :key="user.id" class="chat-user" @click="selectUser(user)">
                        {{ user.name }}
                        <!-- 未讀提示 (目前重整後會消失，因為SQL沒有未讀訊息欄位) -->
                        <!-- <span v-if="user.unreadCount > 0" class="badge bg-danger ms-2">
                            {{ user.unreadCount }}
                        </span> -->
                    </div>
                </div>

                <!-- 訊息區 -->
                <div class="chat-messages-container">
                    <div class="chat-messages" ref="chatContainerRef">
                        <!-- 所有訊息 -->
                        <div v-for="message in messages" :key="message.id" class="chat-message"
                            :class="{ 'sent': message.senderId == saId, 'received': message.senderId != saId }">
                            {{ message.content }}

                            <!-- 訊息預覽圖片區 -->
                            <div v-if="message.photos.length > 0" class="chat-image-preview">
                                <div class="image-preview-container">
                                    <div v-for="(image) in message.photos" class="preview-item">
                                        <img :src="'data:image/jpeg;base64,' + image" alt="預覽圖片" class="preview-img"
                                            @click="emitImage(image)" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 上傳圖片預覽區 -->
                    <div v-if="uploadImages.length > 0" class="chat-image-preview">
                        <div class="image-preview-container">
                            <div v-for="(image, index) in uploadImages" :key="index" class="preview-item">
                                <img :src="image" alt="預覽圖片" class="preview-img" />
                                <button class="btn btn-danger btn-sm remove-image" @click="removeImage(index)">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <button class="btn btn-danger btn-sm clear-images" @click="clearAllImages">刪除所有圖片</button>
                    </div>

                    <!-- 訊息輸入區 -->
                    <div class="chat-input">
                        <textarea v-model="newMessage" @keydown.enter.prevent="handleEnter" placeholder="輸入訊息..."
                            class="form-control"></textarea>
                        <input type="file" @change="handleFileUpload" class="d-none" ref="fileInputRef" multiple />
                        <button @click="triggerFileInput" class="btn btn-secondary ms-2 me-3">圖片</button>
                        <button @click="sendMessage" class="btn btn-primary" :disabled="!isSelectUser">送出</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import axios from 'axios';
import { Client } from "@stomp/stompjs";
import SockJS from 'sockjs-client';

const PATH = `${import.meta.env.VITE_API_URL}`;

const isOpen = ref(false);  // 聊天室開關
const users = ref([]);
const messages = ref({});   // 所有聊天訊息
const newMessage = ref(''); // 新訊息(輸入中的訊息)
const uploadImages = ref([]); // 上傳的圖片
const fileInputRef = ref(null);    // 圖片上傳input元件
const chatContainerRef = ref(null);

const selectedUser = ref(null); // 當前選擇的用戶
const saId = 23; //FIXME: 假設為saId

const emit = defineEmits(['open-image']);
const emitImage = (image) => {
    emit('open-image', image);
};

onMounted(async () => {
    fetchChatUsers();
})

const scrollToBottom = () => {
    if (chatContainerRef.value) {
        chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
    }
};

watch(messages, async () => {
    await nextTick();
    scrollToBottom();
}, { deep: true });

watch(chatContainerRef, (newRef) => {
    if (newRef) {
        scrollToBottom();
    }
}, { immediate: true });

const isHideChat = computed(() => !isOpen.value);
const isShowChat = computed(() => isOpen.value);
const isSelectUser = computed(() => selectedUser.value);

// ========================== websocket ==========================

const stompClient = new Client({
    brokerURL: "ws://localhost:8080/chat", // WebSocket 伺服器 URL
    connectHeaders: {},
    reconnectDelay: 5000, // 斷線重連
    webSocketFactory: () => new SockJS("http://localhost:8080/chat"), // 使用 SockJS 連線
});

stompClient.onConnect = () => {
    // 訂閱sa頻道
    stompClient.subscribe(`/topic/messages/${saId}`, (message) => {
        const msg = JSON.parse(message.body);

        // 只顯示當前選中的聊天對象的訊息
        if (selectedUser.value && (msg.senderId === selectedUser.value.id || msg.senderId === saId)) {
            messages.value.push(msg);
        }
        else {
            // 新訊息來自不是目前選中的人 -> 加上未讀數
            const sender = users.value.find(u => u.id === msg.senderId);
            if (sender)
                sender.unreadCount++;
        }

    });
};

stompClient.activate();

const sendMessage = async () => {
    if (newMessage.value.trim() === '') return; // 如果訊息為空則不發送

    let uploadedPhotoUrls = [];

    if (uploadImages.value.length > 0) {
        // 上傳每張圖片
        await axios({
            method: 'post',
            url: `${PATH}/chatRoom/api/uploadPhoto`,
            headers: { 'Content-Type': 'application/json' },
            data: {
                userId: saId.toString(),
                image: uploadImages.value
            }

        })
            .then(response => {
                // console.log('上傳圖片:', response.data.url);
                response.data.forEach(img => {
                    uploadedPhotoUrls.push(img.url);
                });
            })
            .catch(error => console.log("圖片上傳失敗", error));
    }

    const messageData = {
        senderId: Number(saId),
        receiverId: Number(selectedUser.value.id),
        content: newMessage.value,
        sendTime: new Date(),
        photos: uploadedPhotoUrls,
    }

    if (stompClient.connected && selectedUser.value) {
        stompClient.publish({
            destination: "/app/send",
            body: JSON.stringify(messageData),
        });
    }

    newMessage.value = '';
    uploadImages.value = [];

};

// 獲取所有用戶(有聊天訊息的)
function fetchChatUsers() {
    axios({
        method: 'get',
        url: `${PATH}/chatRoom/api/getChatUsers`,
        params: {
            senderId: saId,
        }

    })
        .then(response => {
            // console.log('所有聊天用戶:', response.data.chatUsers);
            users.value = response.data.chatUsers.map(user => ({
                ...user,
                unreadCount: 0  // 未讀訊息計算
            }));

        })
        .catch(error => console.log(error));
}

// 獲取歷史聊天訊息
async function fetchChatMessages(userId) {
    axios({
        method: 'get',
        url: `${PATH}/chatRoom/api/getChatMessagesHistory`,
        params: {
            senderId: saId,
            receiverId: userId,
        }

    })
        .then(response => {
            messages.value = response.data.chatMessagesHistory;
            // console.log('歷史聊天訊息:', messages.value);
        })
        .catch(error => console.log(error));
}

// ==========================  ==========================

// 變更enter觸發事件
const handleEnter = (event) => {
    if (event.shiftKey) {
        // Shift + Enter 換行
        newMessage.value += '\n';
    } else {
        // 單獨按 Enter 則發送訊息
        sendMessage();
        event.preventDefault(); // 防止換行
    }
};

const selectUser = (user) => {
    // console.log('選擇聊天對象:', user);
    selectedUser.value = user;
    fetchChatMessages(selectedUser.value.id);

    // 把未讀訊息數清零
    const u = users.value.find(u => u.id === user.id);
    if (u)
        u.unreadCount = 0;

};

const triggerFileInput = () => {
    fileInputRef.value.click();
};

const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Image = e.target.result;

                // 檢查圖片是否已存在
                if (!uploadImages.value.includes(base64Image)) {
                    uploadImages.value.push(base64Image);
                } else {
                    // console.log("圖片已存在，未重複加入");
                }
            };
            reader.readAsDataURL(file);
        });
    }
    // **關鍵：清空 input，確保能重新選擇相同檔案**
    event.target.value = "";
};

const removeImage = (index) => {
    uploadImages.value.splice(index, 1);
};

const clearAllImages = () => {
    uploadImages.value = [];
};



</script>

<style scoped>
.chat-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    height: 50px;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.chat-button i {
    font-size: 2rem;
}

.chat-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 35%;
    height: 80%;
    background: white;
    border: 1px solid #ccc;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: #6B51DF;
    color: white;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

.chat-content {
    display: flex;
    flex: 1;
    overflow: hidden;
    height: calc(100% - 50px);
    /* 減去標題欄的高度 */
}

.chat-list {
    width: 20%;
    border-right: 1px solid #ddd;
    overflow-y: auto;
    padding: 10px;
}

.chat-user {
    padding: 8px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
}

.chat-user:hover {
    background: #f0f0f0;
}

.chat-messages-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 10px;
}

.chat-messages {
    flex: 1;
    display: flex;
    flex-direction: column;
    /* justify-content: flex-end; */
    overflow-y: auto;
    max-height: 100%;
}

.chat-messages {
    /*  \n 會自動轉換成換行 */
    white-space: pre-line;
}

.chat-message {
    display: inline-block;
    word-wrap: break-word;
    word-break: break-word;
    max-width: 70%;
    padding: 8px;
    margin-bottom: 5px;
    border-radius: 10px;
    background: #f1f1f1;
    word-wrap: break-word;
}

.sent {
    align-self: flex-end;
    background: #6B51DF;
    color: white;
}

.received {
    align-self: flex-start;
    background: #e5e5e5;
    color: black;
}

.chat-input {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    padding: 10px;
    border-top: 1px solid #ddd;
}

.chat-input textarea {
    resize: none;
    min-height: 50px;
    max-height: 100px;
    width: 70%;
    margin-right: 10px;
}

.chat-image-preview {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
}

.image-preview-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
}

.preview-item {
    position: relative;
}

.preview-img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 5px;
    border: 1px solid #ccc;
    cursor: pointer;
}

.remove-image {
    position: absolute;
    top: -5px;
    right: -5px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 50%;
    padding: 5px;
}

.clear-images {
    margin-top: 10px;
    background-color: #ff4d4f;
    color: white;
    border-radius: 5px;
}

.remove-image {
    width: 36px;
    /* 調整按鈕大小 */
    height: 36px;
    border-radius: 50%;
    /* 讓按鈕變成圓形 */
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 0, 0, 0.8);
    /* 紅色背景，略帶透明 */
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
}

.remove-image:hover {
    background-color: red;
    /* 滑鼠移上去變深紅色 */
}

.remove-image i {
    color: white;
    /* 讓垃圾桶圖示變成白色 */
    font-size: 18px;
}
</style>