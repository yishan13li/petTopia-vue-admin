import request from '@/utils/request'

// 獲取會員列表
export function getMemberList(params) {
  return request({
    url: '/api/admin/members',
    method: 'get',
    params
  })
}

// 新增會員
export function createMember(data) {
  return request({
    url: '/api/admin/members',
    method: 'post',
    data
  })
}

// 刪除會員
export function deleteMember(memberId) {
  return request({
    url: `/api/admin/members/${memberId}`,
    method: 'delete'
  })
}

// 批量更新會員狀態
export function batchUpdateMemberStatus(data) {
  return request({
    url: '/api/admin/members/batch-update',
    method: 'post',
    data
  })
} 