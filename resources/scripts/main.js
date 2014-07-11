$(document).ready(function() {
    (function($) {
        "use strict";
        $(document).on("click", ".js-thumblist a", function(e) {
            e.preventDefault();
            var $el = $(this);
            var target = $el.closest(".js-thumblist").data("target");
            var $target = $(target);
            var src = $el.attr("href");
            $target.attr("src", src);
        });
    })(jQuery);
    $(document).on("click", ".js-addtocart", function(e) {
        e.preventDefault();
        $(this).sendRequest("shop:onAddToCart", {
            update: {
                "#mini-cart": "shop-minicart",
                "#product-page": "shop-product",
                "#modal-minicart": "modal-minicart"
            },
            onAfterUpdate: function() {
                $("#modal-minicart").modal({
                    backdrop: false,
                    show: true
                });
            }
        });
    });
    $("#modal-minicart").on("mouseleave", ".modal-dialog", function() {
        $("#modal-minicart").modal("hide");
    });
    (function($) {
        var $source = $("#billing-info");
        var $sourceInput = $source.find(":input:not([type=hidden])");
        var $target = $("#shipping-info");
        var $targetInput = $target.find(":input:not([type=hidden])");
        var _regex = /\[(.*?)\]/;
        var _ev = "keyup keypress blur change";
        $(document).on("click.address update:address", ".js-mirrordata", function() {
            if ($(this).is(":checked")) {
                mirrorAll();
                $sourceInput.on(_ev, mirrorField);
            } else {
                $sourceInput.off(_ev, mirrorField);
            }
        });
        $(".js-mirrordata").trigger("update:address");
        function mirrorAll() {
            $sourceInput.each(function() {
                mirrorField.apply(this);
            });
        }
        function mirrorField() {
            if (!$(this).attr("name")) {
                return;
            }
            var $el = $(this);
            var mirrorVal = $el.val();
            var nameMatch = $el.attr("name").match(_regex);
            if (!nameMatch) {
                return;
            }
            nameMatch = nameMatch[1];
            var re = new RegExp(nameMatch, "g");
            var $targetEl = $targetInput.filter(function() {
                return this.name.match(re);
            });
            $targetEl.val(mirrorVal);
            if ($el[0].id === "billing_country") {
                $targetEl.trigger("change");
            }
        }
    })(jQuery);
    $(document).on("change", "#payment_method input", function() {
        $("#payment_form").html('<i class="fa fa-refresh fa-spin"/>');
        $(this).sendRequest("shop:onUpdatePaymentMethod", {
            update: {
                "#payment_form": "shop-paymentform"
            }
        });
    });
});