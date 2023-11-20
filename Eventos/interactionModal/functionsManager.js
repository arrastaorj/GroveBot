
const isHex = (hex) => {
	if (hex.match(/#[a-zA-Z0-9]{6}/)) return true
	return false;
}

function isImage(url) {
	if (typeof url !== 'string') return false;
	return (url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) != null);
}

function isLink(url) {
	if (typeof url !== 'string') return false;
	let regex = /^(ftp|http|https):\/\/[^ "]+$/
	return (regex.test(url));
}

module.exports = {
	isHex,
	isImage,
	isLink,
}