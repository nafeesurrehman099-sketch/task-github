// ===== Load Products =====

let products = JSON.parse(localStorage.getItem("products"));

if (!products) {

    products = [
        {
            title: "Wireless Headphones",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
            description: "High quality wireless headphones.",
            category: "Electronics",
            price: 2500
        },
        {
            title: "Smart Watch",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
            description: "Modern smart watch.",
            category: "Accessories",
            price: 3500
        },
        {
            title: "Sports Shoes",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
            description: "Comfortable sports shoes.",
            category: "Shoes",
            price: 4000
        }
    ];

    localStorage.setItem("products", JSON.stringify(products));

}

// Jis product ko edit kar rahe hain uska index (null = naya product add)
let editIndex = null;


// ===== Helper: Save =====

function saveProducts() {

    try {
        localStorage.setItem("products", JSON.stringify(products));
        return true;
    } catch (error) {
        return false;
    }

}


// ===== Helper: Image ko chhota karke base64 banao =====

function resizeImage(file, callback) {

    let reader = new FileReader();

    reader.onload = function () {

        let img = new Image();

        img.onload = function () {

            let maxWidth = 600;
            let scale = Math.min(1, maxWidth / img.width);

            let canvas = document.createElement("canvas");
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;

            canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);

            callback(canvas.toDataURL("image/jpeg", 0.8));

        };

        img.src = reader.result;

    };

    reader.readAsDataURL(file);

}


// ===== HOME PAGE: Display Products =====

function displayProducts() {

    let productContainer = document.getElementById("productContainer");

    if (!productContainer) {
        return;
    }

    productContainer.innerHTML = "";

    products.forEach(function (product) {

        let card = document.createElement("div");
        card.className = "product-card";

        let image = document.createElement("img");
        image.src = product.image;
        image.alt = product.title;

        let title = document.createElement("h3");
        title.textContent = product.title;

        let description = document.createElement("p");
        description.textContent = product.description;

        let category = document.createElement("p");
        category.textContent = "Category: " + product.category;

        let price = document.createElement("p");
        price.textContent = "Rs. " + product.price;

        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(category);
        card.appendChild(price);

        productContainer.appendChild(card);

    });

}

displayProducts();


// ===== DASHBOARD: Added Products List =====

function displayAdminProducts() {

    let list = document.getElementById("adminProductList");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    if (products.length === 0) {
        let empty = document.createElement("p");
        empty.className = "empty-msg";
        empty.textContent = "No products yet.";
        list.appendChild(empty);
        return;
    }

    products.forEach(function (product, index) {

        let item = document.createElement("div");
        item.className = "admin-item";

        let image = document.createElement("img");
        image.src = product.image;
        image.alt = product.title;

        let info = document.createElement("div");
        info.className = "admin-item-info";

        let title = document.createElement("h4");
        title.textContent = product.title;

        let meta = document.createElement("p");
        meta.textContent = product.category + " | Rs. " + product.price;

        info.appendChild(title);
        info.appendChild(meta);

        let actions = document.createElement("div");
        actions.className = "admin-actions";

        let editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "btn-edit";
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", function () {
            startEdit(index);
        });

        let deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn-delete";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", function () {
            deleteProduct(index);
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        item.appendChild(image);
        item.appendChild(info);
        item.appendChild(actions);

        list.appendChild(item);

    });

}


// ===== DELETE =====

function deleteProduct(index) {

    if (!confirm("Kya aap is product ko delete karna chahte hain?")) {
        return;
    }

    products.splice(index, 1);
    saveProducts();

    // Agar wahi product edit ho raha tha to form reset karo
    if (editIndex === index) {
        resetForm();
    } else if (editIndex !== null && index < editIndex) {
        editIndex--;
    }

    displayAdminProducts();

}


// ===== EDIT =====

function startEdit(index) {

    let product = products[index];
    editIndex = index;

    document.getElementById("productTitle").value = product.title;
    document.getElementById("productDescription").value = product.description;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productPrice").value = product.price;

    // Edit ma naya image zaroori nahi
    document.getElementById("productImage").value = "";
    document.getElementById("productImage").required = false;

    document.getElementById("formTitle").textContent = "Edit Product";
    document.getElementById("submitBtn").textContent = "Update Product";
    document.getElementById("cancelEdit").style.display = "block";
    document.getElementById("imageHint").style.display = "block";

    window.scrollTo({ top: 0, behavior: "smooth" });

}


function resetForm() {

    let form = document.getElementById("productForm");

    if (!form) {
        return;
    }

    form.reset();
    editIndex = null;

    document.getElementById("productImage").required = true;
    document.getElementById("formTitle").textContent = "Add New Product";
    document.getElementById("submitBtn").textContent = "Add Product";
    document.getElementById("cancelEdit").style.display = "none";
    document.getElementById("imageHint").style.display = "none";

}


// ===== ADD / UPDATE =====

let productForm = document.getElementById("productForm");

if (productForm) {

    displayAdminProducts();

    document.getElementById("cancelEdit").addEventListener("click", resetForm);

    productForm.addEventListener("submit", function (event) {

        event.preventDefault();

        let title = document.getElementById("productTitle").value;
        let imageFile = document.getElementById("productImage").files[0];
        let description = document.getElementById("productDescription").value;
        let category = document.getElementById("productCategory").value;
        let price = Number(document.getElementById("productPrice").value);

        function finish(imageData) {

            let productData = {
                title: title,
                image: imageData,
                description: description,
                category: category,
                price: price
            };

            let backup = products.slice();
            let isEditing = editIndex !== null;

            if (isEditing) {
                products[editIndex] = productData;
            } else {
                products.push(productData);
            }

            if (!saveProducts()) {
                products = backup;
                alert("Storage full ho gaya! Koi purana product delete karo ya chhota image lo.");
                return;
            }

            alert(isEditing ? "Product Updated Successfully!" : "Product Added Successfully!");

            resetForm();
            displayAdminProducts();

        }

        if (imageFile) {

            resizeImage(imageFile, finish);

        } else if (editIndex !== null) {

            // Naya image nahi chuna, purani image rakho
            finish(products[editIndex].image);

        } else {

            alert("Please select a product image!");

        }

    });

}
