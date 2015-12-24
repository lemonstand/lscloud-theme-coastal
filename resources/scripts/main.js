'use strict';

$(window).on('onAjaxAfterUpdate', function() {
  $('html, body').animate({ scrollTop: 0 }, 0);
});

$(document).ready(function() {
    (function($) {
        "use strict";
        $(document).on("click", ".js-thumblist a", function(e) {
            e.preventDefault();
            var $el = $(this);
            var target = $el.closest(".js-thumblist").data("target");
            var $target = $(target);
            var src = $el.attr("href");
            $el.parent().addClass("selected").siblings().removeClass("selected");
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

        var $chk = $(document).find('.js-mirrordata');

        var _regex = /\[(.*?)\]/;
        var _ev = "keyup blur change";

        // Update vars.
        $(window).on('onAfterAjaxUpdate', function(){
            $source = $("#billing-info");
            $sourceInput = $source.find(":input:not([type=hidden])");
            $target = $("#shipping-info");
            $targetInput = $target.find(":input:not([type=hidden])");

            $targetInput.prop('disabled', $chk.is(':checked'));
        });

        // Update on typing.
        $(document).on(_ev, $sourceInput, function(ev) {

            $chk = $(document).find('.js-mirrordata');

            if (!$chk.is(':checked')) {
                return;
            }

            mirrorField.apply(ev.target);

            return false;
        });

        $(document).on('change', $chk, function() {
            $targetInput.prop('disabled', $chk.is(':checked'));
        });

        $targetInput.prop('disabled', $chk.is(':checked'));


        function mirrorField() {

            if (!$(this).attr("name")) {
                return;
            }

            var $el = $(this);
            var mirrorVal = $el.val();
            var nameMatch = $el.attr("name").match(_regex);

            // $target = $("#shipping-info");
            // $targetInput = $target.find(":input:not([type=hidden])");

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

    $("#cart-content").on("keydown", "input#coupon", function(ev) {
        if (ev.which === 13) {
            $(this).sendRequest("shop:cart", {
                update: {
                    "#cart-content": "shop-cart-content",
                    "#mini-cart": "shop-minicart"
                },
                extraFields: {
                    set_coupon_code: 1
                }
            });
        }
    });
    $("#cart-content").on("keydown", "input.quantity", function(ev) {
        if (ev.which === 13) {
            $(this).sendRequest("shop:cart", {
                update: {
                    "#cart-content": "shop-cart-content",
                    "#mini-cart": "shop-minicart"
                }
            });
        }
    });
    $("#checkout-page").on("change", "#shipping-methods input", function() {
        $(this).sendRequest("shop:onCheckoutShippingMethod", {
            update: {
                "#checkout-totals": "shop-checkout-totals",
                "#mini-cart": "shop-minicart"
            }
        });
    });
    $(document).on("change", "#payment_method input", function() {
        $("#payment_form").html('<i class="fa fa-refresh fa-spin"/>');
        $(this).sendRequest("shop:onUpdatePaymentMethod", {
            update: {
                "#payment_form": "shop-paymentform"
            }
        });
    });
});
