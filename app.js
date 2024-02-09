$(document).ready(function () {
  var observer = new MutationObserver(function (mutationsList, observer) {
    var snipcartWrapper = $("#snipcart .snipcart-layout--large");

    if (snipcartWrapper.length) {
      var radioButtons = $("input[type=radio]");
      var radioInPost = $("input[type=radio][value=inpost]");

      if (radioButtons.length) {
        if (radioInPost.prop("checked")) {
          $(".custom-geowidget").css("display", "block");
          appendGeoWidget();
          observer.disconnect();
        }
        radioButtons.on("change", function () {
          if (radioInPost.prop("checked")) {
            $(".custom-geowidget").css("display", "block");
            appendGeoWidget();
            observer.disconnect();
          } else {
            $(".custom-geowidget").css("display", "none");
          }
        });
      }
    }
  });

  function appendGeoWidget() {
    var snipcartBillingForm = $("#snipcart-billing-form");

    var nameField = $(snipcartBillingForm).find('input[name="name"]');
    var streetField = $(snipcartBillingForm).find(".snipcart-typeahead__input");
    var cityField = $(snipcartBillingForm).find('input[name="city"]');
    var provinceField = $(snipcartBillingForm).find('input[name="province"]');
    var codeField = $(snipcartBillingForm).find('input[name="postalCode"]');

    var firstChild = $(".snipcart-layout__cols > :first-child");
    var targetColumn = firstChild;
    var token =
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwMjEzODc2NDIsImlhdCI6MTcwNjAyNzY0MiwianRpIjoiYWYwNmI2ZDctNWVmNi00OTEzLWJlMTgtZGUyY2NmM2UxMjkzIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNToxQTZWb2RnMHRhby1WMWtUV1dXRUtfNWEwVmdhZkZfUWdYMkFWWVQxSzVBIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiMjk1OTU0YjItZTQ4Zi00Y2Y1LWFjNWMtOWZlYzlhYTI2NWIyIiwic2NvcGUiOiJvcGVuaWQgYXBpOmFwaXBvaW50cyIsInNpZCI6IjI5NTk1NGIyLWU0OGYtNGNmNS1hYzVjLTlmZWM5YWEyNjViMiIsImFsbG93ZWRfcmVmZXJyZXJzIjoiKi53ZWJmbG93LmlvIiwidXVpZCI6ImRiZGZhZWIxLTA0YWItNGYwNC04NDVkLTRlMWEwZGY3MGI5YiJ9.ir05XGASkmQrSsxt5bPFtQz9ItiRmaTp0wxaouRnh3FtiLGag1JT5XX77oNeluEla4LimEEXcZnrzNGL8PQ01Aa12c5OLFdATtZPIzdC_EXpIydahL_XujDU6KWGoJoCMCEf4g-TTumYTi1-9n_dO864RPA9fn-pVFjQvm-ABK1B3rJyRv-73dEu4v-cLvv1UidF005f3kY1WT1TVlml4wCU4c-BBAc_ocqYco5qO-6basAPQyiWZ8xDAErOHjovJvh39YoVcnvhp2GNpMpOUJrhBpC5E_PzMuJHt-piKoSwN6pI37lFfsIge8Lietl2NmSjEhni_dOLCxB26epRZw";

    targetColumn.append(
      `<div class="custom-geowidget"><inpost-geowidget id="geowidget" onpoint="handlePointSelection" token="${token}" language="pl" config="parcelCollect"></inpost-geowidget></div>`
    );

    const geowidget = document.getElementById("geowidget");

    geowidget.addEventListener("inpost.geowidget.init", (event) => {
      const api = event.detail.api;
      api.changePosition(
        {
          longitude: 22.5684,
          latitude: 51.2465,
        },
        15
      );
    });

    geowidget.addEventListener("handlePointSelection", async (event) => {
      var details = event.detail;
      try {
        await Snipcart.api.cart.update({
          email: "john.doe@snipcart.com",
          shipToBillingAddress: false,
          billingAddress: {
            name: nameField.val(),
            firstName: nameField.val(),
            // company: "Sergiusz",
            address1: streetField.val(),
            city: cityField.val(),
            country: "PL",
            postalCode: codeField.val(),
            province: provinceField.val(),
            phone: "123432345",
          },
          shippingAddress: {
            name: nameField.val(),
            firstName: nameField.val(),
            // company: "",
            address1: details.address.line1,
            city: details.address_details.city,
            country: "PL",
            postalCode: details.address_details.post_code,
            province: details.address_details.province,
            phone: "666555444",
          },
        });
      } catch (error) {
        console.log(error);
      }
      console.log(Snipcart.store.getState().cart);
      console.log(details);
      console.log(provinceField.val());
    });
  }

  observer.observe(document.querySelector("body"), {
    childList: true,
    subtree: true,
  });
});

var style = document.createElement("style");
style.innerHTML = `
.custom-geowidget {
 height: 35vh;
 margin-bottom: 4rem;
}

.custom-geowidget #geowidget {
 height: 100%;
}
`;
document.head.appendChild(style);
