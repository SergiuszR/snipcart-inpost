let globalBillingDetails = null;
let globalDetails = null;
let globalEmail = null;
let geoToken = process.env.TOKEN_GEOTOKEN;
let apiToken = process.env.TOKEN_APITOKEN;

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

    $(
      `<div class="custom-geowidget"><inpost-geowidget id="geowidget" onpoint="handlePointSelection" token="${geoToken}" language="${userLang}" config="parcelCollect"></inpost-geowidget></div>`
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
      globalDetails = event.detail;
      globalBillingDetails = Snipcart.store.getState().cart.billingAddress;
      globalEmail = Snipcart.store.getState().cart.email;
      try {
        await Snipcart.api.cart.update({
          email: globalEmail,
          shipToBillingAddress: false,
          billingAddress: {
            name: globalBillingDetails.name,
            firstName: globalBillingDetails.firstName,
            address1: globalBillingDetails.address1,
            city: globalBillingDetails.city,
            country: globalBillingDetails.country,
            postalCode: globalBillingDetails.postalCode,
            province: globalBillingDetails.province,
            phone: globalBillingDetails.phone,
          },
          shippingAddress: {
            name: globalBillingDetails.name,
            firstName: globalBillingDetails.firstName,
            address1: globalDetails.address.line1,
            address2: `${globalDetails.name}, ${globalDetails.location_description}`,
            city: globalDetails.address_details.city,
            country: globalBillingDetails.country,
            postalCode: globalDetails.address_details.post_code,
            province: globalDetails.address_details.province,
            phone: globalBillingDetails.phone,
          },
        });

        pointSelected = true;
      } catch (error) {
        console.log(error);
      }
      console.log(globalDetails);
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
document.addEventListener("snipcart.ready", function () {
  Snipcart.events.on("cart.confirmed", function (order) {
    if (!globalBillingDetails) throw new Error("Billing details not available");

    // Creating a shipment
    $.ajax({
      url: "https://sandbox-api-shipx-pl.easypack24.net/v1/organizations/3879/shipments",
      type: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        receiver: {
          first_name: globalBillingDetails.firstName,
          last_name: globalBillingDetails.name,
          email: globalEmail,
          phone: globalBillingDetails.phone,
        },
        parcels: {
          template: "small",
        },
        insurance: {
          amount: 25,
          currency: "PLN",
        },
        cod: {
          amount: 12.5,
          currency: "PLN",
        },
        custom_attributes: {
          sending_method: "parcel_locker",
          target_point: globalDetails.name,
        },
        service: "inpost_locker_standard",
        reference: "snipcart",
      }),
      success: function (response) {
        console.log("Server response:", response);
        // Shipment created successfully; you can now handle it in your package manager
      },
      error: function (error) {
        console.error("Error creating shipment:", error);
      },
    });
  });
});
