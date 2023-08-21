$(".card").on("click", function() {
    $(".detail").addClass("active");
})

$(".close-detail").on("click", function() {
    $(".detail").removeClass("active");
})

$(".menu-bar").on("click", function() {
    $(".sidebar").addClass("active");
})

$(".logo").on("click", function() {
    $(".sidebar").removeClass("active")
})

$("#dropdown").on("click", function(e) {
    e.preventDefault()

    const dropdownContent = $(".dropdown-menu");
    
    if (dropdownContent.css("display") === "none") {
        dropdownContent.css("display", "flex");
    } else {
        dropdownContent.css("display", "none");
    }
});