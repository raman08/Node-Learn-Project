const deleteProduct = btn => {
	const productId = btn.dataset.productid;
	console.log(productId);
	const productElement = document.getElementById(`product_${productId}`);
	console.log(productElement);
	fetch(`/admin/product/delete/${productId}`, { method: 'DELETE' })
		.then(result => {
			return result.json();
		})
		.then(data => {
			console.log(data);
			productElement.parentNode.removeChild(productElement);
		})
		.catch(err => {
			console.log(err);
		});
};
