$(document).ready(function () {
  var observer = new MutationObserver(checkSnipcartWrapper);

  function checkSnipcartWrapper(mutationsList, observer) {
    var snipcartWrapper = $("#snipcart .snipcart-layout--large");

    if (snipcartWrapper.length) {
      var radioInPost = $("input[type=radio][value=inpost]");
      handleRadioButtons(radioInPost, observer);
      var radioRegular = $("input[type=radio][value='regularna-wysyka']");
      const continueToPaymentButton = $(".snipcart-base-button__label")
        .filter(function () {
          return $(this).text().trim() === "Continue to payment";
        })
        .parent();
      handleContinueButton(radioInPost, radioRegular, continueToPaymentButton);
    }
  }

  function handleRadioButtons(radioInPost, observer) {
    var radioButtons = $("input[type=radio]");
    if (radioButtons.length) {
      checkRadioButtonState(radioInPost, observer);
      handleRadioButtonChange(radioButtons, radioInPost, observer);
    }
  }

  function checkRadioButtonState(radioInPost, observer) {
    if (radioInPost.prop("checked")) {
      showGeowidget();
      appendGeoWidget();
      // observer.disconnect();
    }
  }

  function handleRadioButtonChange(radioButtons, radioInPost, observer) {
    radioButtons.on("change", function () {
      if (radioInPost.prop("checked")) {
        showGeowidget();
        appendGeoWidget();
        observer.disconnect();
      } else {
        hideGeowidget();
      }
    });
  }

  function handleContinueButton(radioInPost, radioRegular) {
    radioInPost.on("change", function () {
      const continueToPaymentButton = getContinueToPaymentButton();
      if (radioInPost.prop("checked")) {
        setTimeout(function () {
          continueToPaymentButton.removeAttr("disabled");
        }, 1200);
      }
    });

    radioRegular.on("change", function () {
      const continueToPaymentButton = getContinueToPaymentButton();
      if (radioRegular.prop("checked")) {
        setTimeout(function () {
          continueToPaymentButton.attr("disabled", "disabled");
        }, 500);
      }
    });
  }

  // Define a helper function to return the button element
  function getContinueToPaymentButton() {
    return $(".snipcart-base-button__label")
      .filter(function () {
        return $(this).text().trim() === "Continue to payment";
      })
      .parent();
  }

  function showGeowidget() {
    $(".custom-geowidget").css("display", "block");
  }

  function hideGeowidget() {
    $(".custom-geowidget").css("display", "none");
  }

  var geowidgetAppended = false;
  var pointSelected = false;

  function appendGeoWidget() {
    if (geowidgetAppended) return;
    var userLang = (navigator.language || navigator.userLanguage).substr(0, 2);
    if (userLang !== "pl") {
      userLang = "en";
    }

    var firstChild = $(".snipcart-layout__cols > :first-child");
    var targetColumn = firstChild;
    var lastChild = targetColumn.children().last();
    var token =
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwMjEzODc2NDIsImlhdCI6MTcwNjAyNzY0MiwianRpIjoiYWYwNmI2ZDctNWVmNi00OTEzLWJlMTgtZGUyY2NmM2UxMjkzIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNToxQTZWb2RnMHRhby1WMWtUV1dXRUtfNWEwVmdhZkZfUWdYMkFWWVQxSzVBIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiMjk1OTU0YjItZTQ4Zi00Y2Y1LWFjNWMtOWZlYzlhYTI2NWIyIiwic2NvcGUiOiJvcGVuaWQgYXBpOmFwaXBvaW50cyIsInNpZCI6IjI5NTk1NGIyLWU0OGYtNGNmNS1hYzVjLTlmZWM5YWEyNjViMiIsImFsbG93ZWRfcmVmZXJyZXJzIjoiKi53ZWJmbG93LmlvIiwidXVpZCI6ImRiZGZhZWIxLTA0YWItNGYwNC04NDVkLTRlMWEwZGY3MGI5YiJ9.ir05XGASkmQrSsxt5bPFtQz9ItiRmaTp0wxaouRnh3FtiLGag1JT5XX77oNeluEla4LimEEXcZnrzNGL8PQ01Aa12c5OLFdATtZPIzdC_EXpIydahL_XujDU6KWGoJoCMCEf4g-TTumYTi1-9n_dO864RPA9fn-pVFjQvm-ABK1B3rJyRv-73dEu4v-cLvv1UidF005f3kY1WT1TVlml4wCU4c-BBAc_ocqYco5qO-6basAPQyiWZ8xDAErOHjovJvh39YoVcnvhp2GNpMpOUJrhBpC5E_PzMuJHt-piKoSwN6pI37lFfsIge8Lietl2NmSjEhni_dOLCxB26epRZw";

    $(
      `<div class="custom-geowidget"><inpost-geowidget id="geowidget" onpoint="handlePointSelection" token="${token}" language="${userLang}" config="parcelCollect"></inpost-geowidget></div>`
    ).insertBefore(lastChild);

    geowidgetAppended = true;

    const geowidget = document.getElementById("geowidget");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        let longitude = position.coords.longitude;
        let latitude = position.coords.latitude;

        geowidget.addEventListener("inpost.geowidget.init", (event) => {
          const api = event.detail.api;
          api.changePosition(
            {
              longitude: longitude,
              latitude: latitude,
            },
            15
          );
        });
      },
      (error) => {
        console.error("An error occurred while retrieving location: ", error);
      }
    );

    geowidget.addEventListener("handlePointSelection", async (event) => {
      var details = event.detail;
      var billingDetails = Snipcart.store.getState().cart.billingAddress;
      console.log(billingDetails);
      try {
        await Snipcart.api.cart.update({
          email: "john.doe@snipcart.com",
          shipToBillingAddress: false,
          billingAddress: {
            name: billingDetails.fullName,
            firstName: billingDetails.fullName,
            address1: billingDetails.address1,
            city: billingDetails.city,
            country: billingDetails.country,
            postalCode: billingDetails.postalCode,
            province: billingDetails.province,
            phone: billingDetails.phone,
          },
          shippingAddress: {
            name: billingDetails.fullName,
            firstName: billingDetails.fullName,
            address1: details.address.line1,
            address2: `${details.name}, ${details.location_description}`,
            city: details.address_details.city,
            country: billingDetails.country,
            postalCode: details.address_details.post_code,
            province: details.address_details.province,
            phone: billingDetails.phone,
          },
        });

        pointSelected = true;
      } catch (error) {
        console.log(error);
      }
      // console.log(Snipcart.store.getState().cart);
      console.log(details);
      // console.log(provinceField.val());
    });
  }

  observer.observe(document.querySelector("body"), {
    childList: true,
    subtree: true,
  });

  applyGeowidgetStyles();
});

function applyGeowidgetStyles() {
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
}
