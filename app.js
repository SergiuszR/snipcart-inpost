let globalBillingDetails = null;
let globalDetails = null;
let globalEmail = null;
let geoToken =
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJkVzROZW9TeXk0OHpCOHg4emdZX2t5dFNiWHY3blZ0eFVGVFpzWV9TUFA4In0.eyJleHAiOjIwMjM0MzYxNDQsImlhdCI6MTcwODA3NjE0NCwianRpIjoiNWFlOGU2NGQtMzM5YS00ZDZiLThjMTUtMzJiZTMyNzliZmVlIiwiaXNzIjoiaHR0cHM6Ly9zYW5kYm94LWxvZ2luLmlucG9zdC5wbC9hdXRoL3JlYWxtcy9leHRlcm5hbCIsInN1YiI6ImY6N2ZiZjQxYmEtYTEzZC00MGQzLTk1ZjYtOThhMmIxYmFlNjdiOjFBNlZvZGcwdGFvLVYxa1RXV1dFSzBRdlFGQWlMbGhyYS1HdVJwVkVNSEUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzaGlweCIsInNlc3Npb25fc3RhdGUiOiIwNDdiN2ExMC02ZGY3LTQ1OWUtYmY5Ni04N2YzZjFmMThjZjkiLCJzY29wZSI6Im9wZW5pZCBhcGk6YXBpcG9pbnRzIiwic2lkIjoiMDQ3YjdhMTAtNmRmNy00NTllLWJmOTYtODdmM2YxZjE4Y2Y5IiwiYWxsb3dlZF9yZWZlcnJlcnMiOiJzbmlwY2FydC10ZXN0b3d5LndlYmZsb3cuaW8iLCJ1dWlkIjoiZDc2YmRjNWUtMDU0NS00OThhLTg2MjctNjRkOWZlMTA5NjlmIn0.JrAU0bV3kDpuZPIe-UkkJRxDdaVJrNayqtQ4saMeUO9eHY4MnQyqKM-_ori7HYYKE0Z0tw9aMANgBWKCf_RMJQM7eTHSmgSkLGx96qbyxDIY7CPMpmnx0rnJuN6lfi142Bwe45MYshdjvAc3I9eFTLzkSTve_mhjYhsoq787Tjo941-KLpQUM2OFMgihv8u9pJ2QIAx8YPogk5TqhyrcbehsK7N-IHuiKlFUlSY3OQ1ockuteItIlCboHwZde1aODZcJgqfe-aS4KmNz-nHNkn3jPbPtJ0ODVoyb0UZEZpU-8nIJtqXFIGf2OcdwX875TGDIj3VMzKD96JV2_G4P7Q";
let apiToken =
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJkVzROZW9TeXk0OHpCOHg4emdZX2t5dFNiWHY3blZ0eFVGVFpzWV9TUFA4In0.eyJleHAiOjIwMjM0MzQ1NTQsImlhdCI6MTcwODA3NDU1NCwianRpIjoiMDg4YTFkZTEtZmM4MS00ZGIwLWI2YjgtMDU2NTYzMDc0MjYwIiwiaXNzIjoiaHR0cHM6Ly9zYW5kYm94LWxvZ2luLmlucG9zdC5wbC9hdXRoL3JlYWxtcy9leHRlcm5hbCIsInN1YiI6ImY6N2ZiZjQxYmEtYTEzZC00MGQzLTk1ZjYtOThhMmIxYmFlNjdiOjFBNlZvZGcwdGFvLVYxa1RXV1dFSzBRdlFGQWlMbGhyYS1HdVJwVkVNSEUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzaGlweCIsInNlc3Npb25fc3RhdGUiOiI0MTMwZThkOS1hYmIxLTQwMzUtODcxYi1iN2Q5M2FhOTI4MTYiLCJzY29wZSI6Im9wZW5pZCBhcGk6YXBpcG9pbnRzIGFwaTpzaGlweCIsInNpZCI6IjQxMzBlOGQ5LWFiYjEtNDAzNS04NzFiLWI3ZDkzYWE5MjgxNiIsImFsbG93ZWRfcmVmZXJyZXJzIjoiIiwidXVpZCI6ImQ3NmJkYzVlLTA1NDUtNDk4YS04NjI3LTY0ZDlmZTEwOTY5ZiIsImVtYWlsIjoic2VyZ2l1c3pyb3p5Y2tpQGljbG91ZC5jb20ifQ.Jb5RITVHPR-M0OXF0ynbDnCrgx-2jc5GaMMAX5tgvNJC_Di-tMdGguTogxEm_WVHTEuT-MdPKHlTtitDBM8N_cjmANkv3oEOlKkVp9_FOkvfT-usBFjH2-HSQLA_rEjc7QjAzlwgCtonoLVGvlZeni48OZ_HHspoeZsBm3PKx7_zx0RUkrPUZW3ojZnJ6Se2VCIFJUVQPnDvjuYBnBp04v3SOPLYGFMG-kZVMWH4V3Nx-iXEU-IfflLALc0DDMOUMGhXN85YAMquj3fEWxS_BvulQKE0YWgxJteHAfCcBqd_CLW8K7hWzzcuMr8QFygO-5zbGKbh3vUTcXQawxaKqQ";
let geowidgetAppended = false;
let pointSelected = false;
let appendGeoWidget = function () {
  let userLang = (navigator.language || navigator.userLanguage).substr(0, 2);
  if (userLang !== "pl") {
    userLang = "en";
  }
  let widgetCode = `<div class="custom-geowidget"><inpost-geowidget id="geowidget" onpoint="handlePointSelection" token="${geoToken}" language="${userLang}" config="parcelCollect"></inpost-geowidget></div>`;

  let targetElement = $(".snipcart-layout__col.snipcart-layout__col--large");
  let childrenCount = targetElement.children().length;

  if (childrenCount > 0) {
    targetElement
      .children()
      .eq(childrenCount - 1)
      .before(widgetCode);
  } else {
    targetElement.append(widgetCode);
  }

  geowidgetAppended = true;

  let geowidget = document.querySelector("#geowidget");

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
};
let createShipment = function () {
  if (!globalBillingDetails) throw new Error("Billing details not available");
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
    },
    error: function (error) {
      console.error("Error creating shipment:", error);
    },
  });
};
document.addEventListener("snipcart.ready", function () {
  Snipcart.events.on("shipping.selected", (shippingMethod) => {
    if (shippingMethod.method === "inPost" && !geowidgetAppended) {
      appendGeoWidget();
    } else if (shippingMethod.method !== "inPost" && geowidgetAppended) {
      $(".custom-geowidget").remove();
      geowidgetAppended = false;
    }
  });

  Snipcart.events.on("cart.confirmed", createShipment);
});
