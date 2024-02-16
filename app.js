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
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJkVzROZW9TeXk0OHpCOHg4emdZX2t5dFNiWHY3blZ0eFVGVFpzWV9TUFA4In0.eyJleHAiOjIwMjM0MzYxNDQsImlhdCI6MTcwODA3NjE0NCwianRpIjoiNWFlOGU2NGQtMzM5YS00ZDZiLThjMTUtMzJiZTMyNzliZmVlIiwiaXNzIjoiaHR0cHM6Ly9zYW5kYm94LWxvZ2luLmlucG9zdC5wbC9hdXRoL3JlYWxtcy9leHRlcm5hbCIsInN1YiI6ImY6N2ZiZjQxYmEtYTEzZC00MGQzLTk1ZjYtOThhMmIxYmFlNjdiOjFBNlZvZGcwdGFvLVYxa1RXV1dFSzBRdlFGQWlMbGhyYS1HdVJwVkVNSEUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzaGlweCIsInNlc3Npb25fc3RhdGUiOiIwNDdiN2ExMC02ZGY3LTQ1OWUtYmY5Ni04N2YzZjFmMThjZjkiLCJzY29wZSI6Im9wZW5pZCBhcGk6YXBpcG9pbnRzIiwic2lkIjoiMDQ3YjdhMTAtNmRmNy00NTllLWJmOTYtODdmM2YxZjE4Y2Y5IiwiYWxsb3dlZF9yZWZlcnJlcnMiOiJzbmlwY2FydC10ZXN0b3d5LndlYmZsb3cuaW8iLCJ1dWlkIjoiZDc2YmRjNWUtMDU0NS00OThhLTg2MjctNjRkOWZlMTA5NjlmIn0.JrAU0bV3kDpuZPIe-UkkJRxDdaVJrNayqtQ4saMeUO9eHY4MnQyqKM-_ori7HYYKE0Z0tw9aMANgBWKCf_RMJQM7eTHSmgSkLGx96qbyxDIY7CPMpmnx0rnJuN6lfi142Bwe45MYshdjvAc3I9eFTLzkSTve_mhjYhsoq787Tjo941-KLpQUM2OFMgihv8u9pJ2QIAx8YPogk5TqhyrcbehsK7N-IHuiKlFUlSY3OQ1ockuteItIlCboHwZde1aODZcJgqfe-aS4KmNz-nHNkn3jPbPtJ0ODVoyb0UZEZpU-8nIJtqXFIGf2OcdwX875TGDIj3VMzKD96JV2_G4P7Q";

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

console.log("local");

const buyNow = document.querySelector("#buy-now");

buyNow.addEventListener("click", () => {
  // Example jQuery snippet for creating a simplified shipment with inPost
  $(document).ready(function () {
    // Creating a shipment
    $.ajax({
      url: "https://sandbox-api-shipx-pl.easypack24.net/v1/organizations/3879/shipments",
      type: "POST",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJkVzROZW9TeXk0OHpCOHg4emdZX2t5dFNiWHY3blZ0eFVGVFpzWV9TUFA4In0.eyJleHAiOjIwMjM0MzQ1NTQsImlhdCI6MTcwODA3NDU1NCwianRpIjoiMDg4YTFkZTEtZmM4MS00ZGIwLWI2YjgtMDU2NTYzMDc0MjYwIiwiaXNzIjoiaHR0cHM6Ly9zYW5kYm94LWxvZ2luLmlucG9zdC5wbC9hdXRoL3JlYWxtcy9leHRlcm5hbCIsInN1YiI6ImY6N2ZiZjQxYmEtYTEzZC00MGQzLTk1ZjYtOThhMmIxYmFlNjdiOjFBNlZvZGcwdGFvLVYxa1RXV1dFSzBRdlFGQWlMbGhyYS1HdVJwVkVNSEUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzaGlweCIsInNlc3Npb25fc3RhdGUiOiI0MTMwZThkOS1hYmIxLTQwMzUtODcxYi1iN2Q5M2FhOTI4MTYiLCJzY29wZSI6Im9wZW5pZCBhcGk6YXBpcG9pbnRzIGFwaTpzaGlweCIsInNpZCI6IjQxMzBlOGQ5LWFiYjEtNDAzNS04NzFiLWI3ZDkzYWE5MjgxNiIsImFsbG93ZWRfcmVmZXJyZXJzIjoiIiwidXVpZCI6ImQ3NmJkYzVlLTA1NDUtNDk4YS04NjI3LTY0ZDlmZTEwOTY5ZiIsImVtYWlsIjoic2VyZ2l1c3pyb3p5Y2tpQGljbG91ZC5jb20ifQ.Jb5RITVHPR-M0OXF0ynbDnCrgx-2jc5GaMMAX5tgvNJC_Di-tMdGguTogxEm_WVHTEuT-MdPKHlTtitDBM8N_cjmANkv3oEOlKkVp9_FOkvfT-usBFjH2-HSQLA_rEjc7QjAzlwgCtonoLVGvlZeni48OZ_HHspoeZsBm3PKx7_zx0RUkrPUZW3ojZnJ6Se2VCIFJUVQPnDvjuYBnBp04v3SOPLYGFMG-kZVMWH4V3Nx-iXEU-IfflLALc0DDMOUMGhXN85YAMquj3fEWxS_BvulQKE0YWgxJteHAfCcBqd_CLW8K7hWzzcuMr8QFygO-5zbGKbh3vUTcXQawxaKqQ",
        // Your TOKEN here
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        sender: {
          company_name: "Company_name",
          first_name: "first_name",
          last_name: "last_name",
          email: "test@grupainteger.pl",
          phone: "321321321",
          address: {
            street: "Czerniakowska",
            building_number: "87A",
            city: "Warszawa",
            post_code: "00-718",
            country_code: "PL",
          },
        },
        receiver: {
          company_name: "Company name",
          first_name: "Jan",
          last_name: "Kowalski",
          email: "test@inpost.pl",
          phone: "111222333",
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
          sending_method: "dispatch_order",
          target_point: "KRA010",
        },
        service: "inpost_locker_standard",
        reference: "Test",
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
