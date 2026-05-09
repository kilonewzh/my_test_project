# <script>
# // 获取站点状态
# fetch('/api/status')
#   .then(res => res.json())
#   .then(data => console.log('站点状态:', data))
#   .catch(err => console.error('请求失败:', err));
#
# // 提交留言示例
# function submitContact() {
#   fetch('/api/contact', {
#     method: 'POST',
#     headers: { 'Content-Type': 'application/json' },
#     body: JSON.stringify({
#       name: '访客',
#       email: 'test@example.com',
#       message: '期待站点早日上线！'
#     })
#   })
#   .then(res => res.json())
#   .then(data => alert(data.message))
#   .catch(err => alert('提交失败'));
# }
# </script>
