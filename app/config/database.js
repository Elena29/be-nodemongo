let url;
if (process.env.NODE_ENV === 'production') {
  url = 'mongodb://admin:root@ds245228.mlab.com:45228/receipts-prod';
} else {
  url = 'mongodb://mongo:27017';
}

module.exports = {
  mongoURI: url
}