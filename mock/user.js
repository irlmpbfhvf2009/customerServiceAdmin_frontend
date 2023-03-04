const users = [
  { name: 'admin', password: '123456', token: 'admin', info: {
    name: '系統管理員'
  }},
  { name: 'editor', password: '123456', token: 'editor', info: {
    name: '編輯人員'
  }},
  { name: 'test', password: '123456', token: 'test', info: {
    name: '測試人員'
  }},
]
export default [
  {
    url: `/mock/user/login`,
    method: 'post',
    response: ({ body }) => {
      const user = users.find(user => {
        return body.name === user.name && body.password === user.password
      })
      if (user) {
        return {
          code: 200,
          data: {
            token: user.token,
          },
        };
      } else {
        return {
          code: 401,
          data: {},
          msg: '用戶名或密碼錯誤'
        };
      }
      
    }
  },
  {
    url: `/mock/user/info`,
    method: 'post',
    response: ({ body }) => {
      const { token } = body
      const info = users.find(user => {
        return user.token === token
      }).info
      if (info) {
        return {
          code: 200,
          data: {
            info: info
          },
        };
      } else {
        return {
          code: 403,
          data: {},
          msg: '無訪問權限'
        };
      }
      
    }
  },
  {
    url: `/mock/user/out`,
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: {},
        msg: 'success'
      };
    }
  },
  {
    url: `/mock/user/passwordChange`,
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: {},
        msg: 'success'
      };
    }
  },
]