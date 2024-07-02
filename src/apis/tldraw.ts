import request from 'utils/request';

export function generateRoom(data: any) {
  return request({
    url: '/tldraw/generateRoom',
    method: 'post',
    data
  });
}

export function joinByUUID(uuid) {
  return request({
    url: `/tldraw/joinByUUID/${uuid}`,
    method: 'get'
  });
}

export function getUUID(params: any) {
  return request({
    url: '/tldraw/getUUID',
    method: 'get',
    params
  });
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  });
}
