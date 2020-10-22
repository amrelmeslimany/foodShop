// Sign up
const formSignup = $('.signup form');
const emailErrorS = $('.signup form .email.error');
const passwordErrorS = $('.signup form .password.error');
formSignup.on("submit", async function(e) {
    e.preventDefault();
    // Reset Values
    emailErrorS.text("");
    passwordErrorS.text("");
    // Get values
    const email = formSignup[0].email.value;
    const password = formSignup[0].password.value;
    try {
        const res = await fetch('/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'content-type': 'application/json' }
        });
        const data = await res.json();
        if (data.errors) {
            emailErrorS.css("visibility", "visible");
            passwordErrorS.css("visibility", "visible");
            emailErrorS.text(data.errors.email);
            passwordErrorS.text(data.errors.password);
        }
        if (data.user) {
            location.assign('/');
        }
    } catch (error) {
        console.log(error)
    }
});
/* ***************************************************************** */
// Login
const formlogin = $('.login form');
const emailErrorL = $('.login form .email.error');
const passwordErrorL = $('.login form .password.error');
formlogin.on("submit", async function(e) {
    e.preventDefault();
    // Reset Values
    emailErrorL.text("");
    passwordErrorL.text("");
    // Get values
    const email = formlogin[0].email.value;
    const password = formlogin[0].password.value;
    try {
        const res = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'content-type': 'application/json' }
        });
        const data = await res.json();
        if (data.errors) {
            emailErrorL.css("visibility", "visible");
            passwordErrorL.css("visibility", "visible");
            emailErrorL.text(data.errors.email);
            passwordErrorL.text(data.errors.password);
        }
        if (data.user) {
            location.assign('/');
        }
    } catch (error) {
        console.log(error)
    }

});
/* ***************************************************** */
const btnAddToCart = $(".box-good button"),
    quantityLocal = localStorage.getItem("quAndTitle");
let arrOfElments = [];
btnAddToCart.on("click", function(e) {
    e.preventDefault();
    $(this).prev(".quantity").slideToggle(120);
    if ($(this).text() == "Save") {
        let quantityValue = $(this).prev(".quantity").val(),
            titleBox = $(this).parent(".card-body").find("h5").text(),
            costBox = $(this).parent(".card-body").find("h4").text();
        // Check if local storage has quantity
        if (quantityLocal == null) {
            arrOfElments.push({ quantity: quantityValue, title: titleBox, cost: costBox });
            localStorage.setItem("quAndTitle", JSON.stringify(arrOfElments));
        } else {
            let newArrOfElments = JSON.parse(quantityLocal).filter(e => {
                if (e.title !== titleBox) {
                    return e;
                }
            });
            newArrOfElments.push({ quantity: quantityValue, title: titleBox, cost: costBox });
            localStorage.setItem("quAndTitle", JSON.stringify(newArrOfElments));
        }

        $(this).text("Add To Cart");
        location.reload();

    } else {
        $(this).text("Save");
    }
});
// Showing Numbers
btnAddToCart.each(function() {
    if ($(this).text() == "Add To Cart") {
        if (quantityLocal != null) {
            JSON.parse(quantityLocal).forEach(e => {
                if (e.title == $(this).parent().find("h5").text()) {
                    if (e.quantity > 0) {
                        $(this).prepend(`<span class="badge badge-dark badge-pill mr-2">${e.quantity}</span>`);
                    }
                }
            });
        }
    }
});
// Add Elments In Table From LocalStorage
const table = $("table.table tbody");

function addProductsToCart() {
    if (quantityLocal != null) {
        JSON.parse(quantityLocal).forEach(e => {
            table.prepend(`<tr>
            <td>
                <h6 class="bold title-product">${e.title.toUpperCase()}</h6>
            </td>
            <td>
                ${e.quantity}
            </td>
            <td class="text-primary bold">
                ${parseInt(e.cost)}.00$
            </td>
            <td class="text-primary bold">
                ${e.quantity * parseInt(e.cost)}.00$
            </td>
            <td>
            <button class="btn btn-danger delete-product p-1 pl-3 pr-3">Delete</button>
            </td>
            </tr>`);
        });
    }
}
addProductsToCart();
// Delete Product
$(".delete-product").click(function(e) {
    e.preventDefault();
    // Confirm
    if (confirm("Sure ?") == true) {
        let deletedArray = JSON.parse(quantityLocal).filter(local_ele => {
            if (local_ele.title != $(this).parent().parent().find("h6.title-product").text()) {
                return local_ele;
            }
        });
        localStorage.setItem("quAndTitle", JSON.stringify(deletedArray));
        location.reload();
    } else {
        return false;
    }
    // $(this).parent().parent().find("td.title-product").text()
});
/* ************************** */
// Make Search for Carts Elements
const searchInput = $(".search-in-cart");
$(".btn-search").on("click", function() {
    let that = $(this);
    if (searchInput.val() != "") {
        table.find("h6").each(function() {
            if ($(this).text().toLowerCase() == searchInput.val().toLowerCase()) {
                table.parent().before(`
                <h3 class="mb-4 mt-3">Searched Products</h3>
                    <table class="table filterd">
                    <thead class="thead-dark"><tr><th>Product Name</th><th>Quantity</th><th>Product Price</th><th>Cost</th><th>Options</th></tr></thead>
                        <tbody>
                            ${$(this).parent().parent().html()}
                        </tbody>
                    </table>
                `);
            } else {
                $(".no-items").show(100).delay(2000).hide(120);
            }
        });
    } else {
        table.parent().prev(".filterd").remove()
        table.parent().parent().find("h3").remove()
    }
});