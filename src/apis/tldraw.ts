import request from 'utils/request';

export function getTldrawApi(params?: any) {
  return request({
    url: '/tldraw/list',
    method: 'get',
    params
  });
}

export function generateRoomApi(data: any) {
  return request({
    url: '/tldraw/generateRoom',
    method: 'post',
    data
  });
}

export function joinByUUIDApi(uuid) {
  return request({
    url: `/tldraw/joinByUUID/${uuid}`,
    method: 'get'
  });
}

export function getUUIDApi(params: any) {
  return request({
    url: '/tldraw/getUUID',
    method: 'get',
    params
  });
}

export function delTldrawByIdsApi(ids) {
  return request({
    url: `/tldraw/${ids}`,
    method: 'delete'
  });
}
