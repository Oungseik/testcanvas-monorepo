POST http://192.168.99.192:8000/admin/providers/add
{
  "nickname": "android",
  "os": "linux",
  "port": 10000,
  "provide_android": true,
  "use_selenium_grid": true,
  "selenium_grid": "http://192.168.99.192:4444",
  "host_address": "192.168.99.192"
}
HTTP  200


GET http://192.168.99.192:8000/admin/providers

DELETE http://192.168.99.192:8000/admin/providers/android

POST http://192.168.99.192:8000/admin/device
{
  "udid":"3586a5ee0704",
  "name":"Redmi 5 Plus",
  "provider":"3586a5ee0704",
  "os_version":"8.1.0",
  "screen_width":"1080",
  "screen_height":"2160",
  "os":"android",
  "usage":"enabled",
  "device_type":"real"
}
HTTP 200

