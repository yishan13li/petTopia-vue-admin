document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("orderTableBody");
    const selectAll = document.getElementById("selectAll");
    const batchEditBtn = document.getElementById("batchEditBtn");
    const batchSaveBtn = document.getElementById("batchSaveBtn");

    const headers = {
        orderId: document.getElementById("orderIdHeader"),
        orderDate: document.getElementById("orderDateHeader"),
        totalAmount: document.getElementById("totalAmountHeader")
    };
    let sortDirections = { orderId: 1, orderDate: 1, totalAmount: 1 };
    let currentSortColumn = null; // 用來記錄當前排序的列

    // === 全選/取消全選功能 ===
    selectAll.addEventListener("change", function () {
        document.querySelectorAll(".orderCheckbox").forEach(checkbox => {
            checkbox.checked = selectAll.checked;
        });
    });

    // === 個別勾選時檢查是否需要取消全選 ===
    tableBody.addEventListener("change", function (event) {
        if (event.target.classList.contains("orderCheckbox")) {
            const checkboxes = document.querySelectorAll(".orderCheckbox");
            const checkedCount = document.querySelectorAll(".orderCheckbox:checked").length;
            selectAll.checked = (checkboxes.length > 0) && (checkedCount === checkboxes.length);
        }
    });

    // === 單筆修改功能 ===
    tableBody.addEventListener("click", function (event) {
        const target = event.target;

        // === 編輯按鈕點擊事件 ===
        if (target.closest(".edit-btn")) {
            const row = target.closest("tr");

            // 檢查是否在批量編輯模式，若是則不進行單筆修改
            if (batchEditBtn.classList.contains("d-none")) return;

            // 若該行未進入編輯模式，則開始編輯
            if (!row.classList.contains("editing")) {
                row.classList.add("editing");
                const cells = row.querySelectorAll("td");
                const editableFields = [1, 5, 6, 7, 8];
                const optionsMap = {
                    1: ["待處理", "已出貨", "已完成"],
                    5: ["未付款", "已付款"],
                    6: ["信用卡", "轉帳", "貨到付款"],
                    7: ["宅配", "7-11 取貨", "全家取貨"]
                };

                // 將指定欄位轉為下拉選單
                editableFields.forEach(index => {
                    const cell = cells[index];
                    const currentValue = cell.innerText.trim();
                    let selectHTML = `<select class="form-select edit-select">`;
                    optionsMap[index].forEach(option => {
                        selectHTML += `<option value="${option}" ${option === currentValue ? "selected" : ""}>${option}</option>`;
                    });
                    selectHTML += `</select>`;
                    cell.innerHTML = selectHTML;
                });

                // 將按鈕切換為「儲存」
                const editBtn = row.querySelector(".edit-btn");
                editBtn.innerHTML = '<i class="bi bi-check-circle"></i>';
                editBtn.classList.add("save-btn");
                editBtn.classList.remove("edit-btn");
            }
        }

        // === 儲存按鈕點擊事件 ===
        if (target.closest(".save-btn")) {
            const row = target.closest("tr");
            const selects = row.querySelectorAll(".edit-select");

            // 將選取的值轉換回純文字
            selects.forEach(select => {
                select.parentElement.innerText = select.value;
            });

            // 將行狀態從「編輯中」移除
            row.classList.remove("editing");

            // 將按鈕切換回「編輯」
            const saveBtn = row.querySelector(".save-btn");
            saveBtn.innerHTML = '<i class="bi bi-pencil"></i>';
            saveBtn.classList.add("edit-btn");
            saveBtn.classList.remove("save-btn");

            // 顯示「修改成功」訊息
            Swal.fire({
                title: '訂單已修改成功!',
                icon: 'success',
                showConfirmButton: false,
                timer: 800
            });
        }

        // === 刪除功能 ===
        document.addEventListener("click", function (event) {
            const target = event.target;
            // 確保點擊的是刪除按鈕
            if (target.closest(".delete-btn")) {
                Swal.fire({
                    title: '確定要刪除這筆訂單嗎？',
                    text: "此操作無法復原！",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        const row = target.closest("tr");
                        row.remove();
                        Swal.fire(
                            '已刪除',
                            '訂單已刪除！',
                            'success'
                        );
                    } else {
                        Swal.fire(
                            '取消',
                            '刪除已取消',
                            'info'
                        );
                    }
                });
            }
        });

    });

    // === 禁用 / 啟用 單筆修改按鈕的函數 ===
    function toggleEditButtons(disabled) {
        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.disabled = disabled;
        });
    }

    // === 批量更新訂單狀態 ===
    batchUpdateBtn.addEventListener("click", function () {
        const selectedStatus = document.getElementById("batchStatusSelect").value; // 取得新狀態

        // 確保選擇了狀態
        if (selectedStatus === "none") {
            Swal.fire({
                icon: 'warning',
                title: '請選擇一個狀態！',
                text: '請從下拉選單中選擇狀態。',
                confirmButtonText: '確定'
            });
            return;
        }


        const selectedRows = Array.from(tableBody.querySelectorAll("tr"))
            .filter(row => row.querySelector(".orderCheckbox").checked); // 找出所有選中的訂單行

        if (selectedRows.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: '請選擇至少一筆訂單進行批量修改！',
                confirmButtonText: '確定'
            });
            return;
        }


        // 判斷選擇的狀態屬於哪種類型
        const statusMap = {
            "訂單處理中": 1, "訂單已完成": 1, "訂單已取消": 1,
            "已付款": 5, "未付款": 5
        };

        const targetColumnIndex = statusMap[selectedStatus];
        if (targetColumnIndex === undefined) {
            Swal.fire({
                icon: 'error',
                title: '無效的狀態選擇！',
                confirmButtonText: '確定'
            });
            return;
        }


        // 確認修改（防止誤操作）
        Swal.fire({
            title: "確定要批量修改這些訂單嗎？",
            text: `將更新 ${selectedRows.length} 筆訂單的狀態為「${selectedStatus}」`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "確定修改",
            cancelButtonText: "取消"
        }).then((result) => {
            if (result.isConfirmed) {
                // 批量更新選定狀態
                selectedRows.forEach(row => {
                    row.cells[targetColumnIndex].innerText = selectedStatus; // 更新對應欄位
                });

                Swal.fire("修改成功！", "訂單狀態已成功批量更新。", "success");
            }
        });
    });

    // === 批量編輯勾選訂單 ===
    tableBody.addEventListener("change", function (event) {
        if (event.target.classList.contains("orderCheckbox")) {
            const row = event.target.closest("tr");
            const isChecked = event.target.checked;

            // 檢查是否至少選擇一筆訂單
            const checkedRows = document.querySelectorAll(".orderCheckbox:checked").length;
            batchEditBtn.disabled = checkedRows === 0; // 沒有勾選時禁用編輯按鈕

            toggleEditButtons(checkedRows > 0); // 禁用 / 啟用 單筆修改按鈕

            if (isChecked) {
                makeRowEditable(row);
            } else {
                revertRowToNormal(row);
            }
        }
    });

    // 批量編輯按鈕
    batchEditBtn.addEventListener("click", function () {
        const selectedRows = Array.from(tableBody.querySelectorAll("tr"))
            .filter(row => row.querySelector(".orderCheckbox").checked);

        if (selectedRows.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: '請選擇至少一筆訂單進行批量修改！',
                confirmButtonText: '確定'
            });
            return;
        }

        selectedRows.forEach(row => {
            makeRowEditable(row);
        });

        batchEditBtn.classList.add("d-none");
        batchSaveBtn.classList.remove("d-none");
        batchCancelBtn.classList.remove("d-none");  // 顯示取消編輯按鈕

        toggleEditButtons(true);  // 禁用單筆編輯按鈕
    });

    // 批量保存修改按鈕
    batchSaveBtn.addEventListener("click", function () {
        document.querySelectorAll(".orderCheckbox:checked").forEach(checkbox => {
            const row = checkbox.closest("tr");
            saveRowChanges(row);
        });

        batchEditBtn.classList.remove("d-none");
        batchSaveBtn.classList.add("d-none");
        batchCancelBtn.classList.add("d-none");  // 隱藏取消編輯按鈕

        // 顯示修改成功的提示，不需要再問確認
        Swal.fire({
            title: '訂單已修改成功!',
            icon: 'success',
            showConfirmButton: false,  // 不顯示確認按鈕
            timer: 800  // 1.5秒後自動關閉
        });

        toggleEditButtons(false); // 啟用每一行的編輯按鈕
    });

    // 設定可編輯模式
    function makeRowEditable(row) {
        const cells = row.querySelectorAll("td");
        const editableFields = [1, 5, 6, 7];
        const optionsMap = {
            1: ["待處理", "已出貨", "已完成"],
            5: ["未付款", "已付款"],
            6: ["信用卡", "轉帳", "貨到付款"],
            7: ["宅配", "7-11 取貨", "全家取貨"]
        };

        editableFields.forEach(index => {
            const cell = cells[index];
            const currentValue = cell.innerText.trim();

            // 💡 先儲存原始文字
            cell.dataset.originalValue = currentValue;

            if (!cell.querySelector("select")) { // 避免重複添加
                let selectHTML = `<select class="form-select edit-select">`;
                optionsMap[index].forEach(option => {
                    selectHTML += `<option value="${option}" ${option === currentValue ? "selected" : ""}>${option}</option>`;
                });
                selectHTML += `</select>`;
                cell.innerHTML = selectHTML;
            }
        });
    }

    // 還原為非編輯模式
    function revertRowToNormal(row) {
        const cells = row.querySelectorAll("td");
        cells.forEach(cell => {
            const select = cell.querySelector("select");
            if (select) {
                // 💡 將欄位還原為原本的文字值
                const originalValue = cell.dataset.originalValue || select.value;
                cell.textContent = originalValue;
            }
        });
    }


    // 保存修改
    function saveRowChanges(row) {
        row.querySelectorAll(".edit-select").forEach(select => {
            select.parentElement.innerText = select.value;
        });
    }

    // === 取消修改功能 ===
    const batchCancelBtn = document.getElementById("batchCancelBtn");
    batchCancelBtn.addEventListener("click", function () {
        document.querySelectorAll(".orderCheckbox:checked").forEach(checkbox => {
            const row = checkbox.closest("tr");

            // 在此處還原下拉選單的選中值
            row.querySelectorAll("select").forEach(select => {
                const selectedValue = select.getAttribute("data-selected-value");
                select.value = selectedValue; // 還原到原始選項
            });

            revertRowToNormal(row);  // 還原每一行的其他修改
        });
        // 隱藏儲存和取消修改按鈕，顯示修改勾選訂單按鈕
        batchCancelBtn.classList.add("d-none");  // 隱藏取消按鈕
        batchSaveBtn.classList.add("d-none");    // 隱藏儲存按鈕
        batchEditBtn.classList.remove("d-none"); // 顯示修改勾選訂單按鈕

        toggleEditButtons(false); // 啟用每一行的編輯按鈕
    });

    // === 監聽取消勾選訂單時更新按鈕顯示 ===
    tableBody.addEventListener("change", function (event) {
        if (event.target.classList.contains("orderCheckbox")) {
            const checkedRows = document.querySelectorAll(".orderCheckbox:checked").length;

            // 若沒有勾選任何訂單，則顯示修改勾選訂單按鈕，隱藏儲存修改按鈕與取消修改按鈕
            if (checkedRows === 0) {
                batchEditBtn.classList.remove("d-none");
                batchSaveBtn.classList.add("d-none");
                batchCancelBtn.classList.add("d-none");
            }
        }
    });

    // === 排序功能 ===
    function sortTable(column, columnIndex) {
        const rows = Array.from(tableBody.querySelectorAll("tr"));
        const direction = sortDirections[column];
        sortDirections[column] *= -1;

        // 根據排序方向修改圖示
        let iconId;
        if (column === 'orderId') {
            iconId = 'orderIdSortIcon';
        } else if (column === 'orderDate') {
            iconId = 'orderDateSortIcon';
        } else if (column === 'totalAmount') {
            iconId = 'totalAmountSortIcon';
        }

        // 更新排序圖示的方向
        updateSortIcon(iconId, direction);

        // 排序邏輯
        rows.sort((rowA, rowB) => {
            let cellA = rowA.cells[columnIndex].innerText.trim();
            let cellB = rowB.cells[columnIndex].innerText.trim();

            if (!isNaN(cellA) && !isNaN(cellB)) {
                return (parseFloat(cellA) - parseFloat(cellB)) * direction;
            } else if (Date.parse(cellA) && Date.parse(cellB)) {
                return (new Date(cellA) - new Date(cellB)) * direction;
            }
            return cellA.localeCompare(cellB) * direction;
        });

        tableBody.innerHTML = "";
        rows.forEach(row => tableBody.appendChild(row));
        // 記錄當前排序的欄位
        currentSortColumn = column;
    }

    function updateSortIcon(iconId, direction) {
        // 重置所有圖示
        document.querySelectorAll(".sort-icon").forEach(icon => {
            icon.classList.remove("fa-sort-up", "fa-sort-down");
            icon.classList.add("fa-sort");
        });

        const icon = document.getElementById(iconId);
        if (direction === 1) {
            icon.classList.remove("fa-sort");
            icon.classList.add("fa-sort-up");  // 顯示向上的圖示
        } else if (direction === -1) {
            icon.classList.remove("fa-sort");
            icon.classList.add("fa-sort-down"); // 顯示向下的圖示
        }

    }

    // === 初始化時動態添加排序圖示 ===
    headers.orderId.innerHTML += '<i id="orderIdSortIcon" class="fa fa-sort sort-icon"></i>';
    headers.orderDate.innerHTML += '<i id="orderDateSortIcon" class="fa fa-sort sort-icon"></i>';
    headers.totalAmount.innerHTML += '<i id="totalAmountSortIcon" class="fa fa-sort sort-icon"></i>';

    // === 標題欄點擊排序 ===
    headers.orderId.addEventListener("click", () => sortTable("orderId", 2));
    headers.orderDate.addEventListener("click", () => sortTable("orderDate", 3));
    headers.totalAmount.addEventListener("click", () => sortTable("totalAmount", 9));

});
