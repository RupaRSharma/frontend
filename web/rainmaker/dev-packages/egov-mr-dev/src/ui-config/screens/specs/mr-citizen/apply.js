import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  updatePFOforSearchResults,
  getBoundaryData
} from "../../../../ui-utils/commons";
import get from "lodash/get";
import set from "lodash/set";
import { footer } from "../mr/applyResource/footer";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  header,
  formwizardFirstStep,
  formwizardSecondStep,
  formwizardThirdStep,
  formwizardFourthStep,
  formwizardFifthStep,
  formwizardSixthStep,
  stepper,
  getMdmsData
} from "../mr/apply";
import { getAllDataFromBillingSlab } from "../utils";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";

const getData = async (action, state, dispatch, tenantId) => {
  await getMdmsData(action, state, dispatch);
  await getAllDataFromBillingSlab(tenantId, dispatch);
  await getBoundaryData(action, state, dispatch, [
    { key: "tenantId", value: tenantId }
  ]);
  dispatch(
    prepareFinalObject(
      "Licenses[0].tradeLicenseDetail.address.tenantId",
      tenantId
    )
  );
  dispatch(
    prepareFinalObject("Licenses[0].tradeLicenseDetail.address.city", tenantId)
  );
};
const updateSearchResults = async (
  action,
  state,
  dispatch,
  queryValue,
  tenantId
) => {
  await getData(action, state, dispatch, tenantId);
  await updatePFOforSearchResults(
    action,
    state,
    dispatch,
    queryValue,
    tenantId
  );
  const queryValueFromUrl = getQueryArg(
    window.location.href,
    "applicationNumber"
  );
  if (!queryValueFromUrl) {
    dispatch(
      prepareFinalObject(
        "Licenses[0].oldLicenseNumber",
        get(
          state.screenConfiguration.preparedFinalObject,
          "Licenses[0].applicationNumber",
          ""
        )
      )
    );
    dispatch(prepareFinalObject("Licenses[0].applicationNumber", ""));
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "visible",
        false
      )
    );
  }
};
const screenConfig = {
  uiFramework: "material-ui",
  name: "apply",
  beforeInitScreen: (action, state, dispatch) => {
    const queryValue = getQueryArg(window.location.href, "applicationNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const applicationNo = queryValue
      ? queryValue
      : get(
          state.screenConfiguration.preparedFinalObject,
          "Licenses[0].oldLicenseNumber",
          null
        );
    if (applicationNo) {
      updateSearchResults(action, state, dispatch, applicationNo, tenantId);

      dispatch(prepareFinalObject("DynamicMdms.TradeLicense.tradeUnits.MdmsJson", null));
    } else {

       getData(action, state, dispatch, tenantId);

    //   const applyFor = window.localStorage.getItem('licenseType');
    //   let legacyLicenseRenewal = window.localStorage.getItem('legacyLicenseRenewal');

    //   set(
    //     action.screenConfig,
    //     "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLicenseType.props.value",
    //     applyFor
    //   );

    //   dispatch(prepareFinalObject("Licenses[0].licenseType", applyFor));

    //   if(applyFor === "TEMPORARY"){
    //   set(
    //     action.screenConfig,
    //     "components.div.children.headerDiv.children.header.children.header.children.key.props.labelKey",
    //     "TL_APPLY_TEMP_TRADELICENSE"
    //   );

    //   set(
    //     action.screenConfig,
    //       "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeToDate.visible",

    //       true

    //   );
    //   set(
    //     action.screenConfig,
    //       "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLicensePeriod.visible",

    //       false

    //   );
    //   dispatch(prepareFinalObject("Licenses[0].tradeLicensePeriod", null));
    //   dispatch(prepareFinalObject("Licenses[0].validTo", null));


    //   }else{
    //     set(
    //       action.screenConfig,
    //         "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeToDate.visible",

    //         false

    //     );

    //     set(
    //       action.screenConfig,
    //         "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLicensePeriod.visible",

    //         true

    //     );

    //     if(legacyLicenseRenewal === "true"){

    //       set(
    //         action.screenConfig,
    //           "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.oldLicenseNo.visible",

    //           true

    //       );
    //       // set(
    //       //   action.screenConfig,
    //       //     "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.oldLicenseNo.required",

    //       //     true

    //       // );
    //       set(
    //         action.screenConfig,
    //         "components.div.children.headerDiv.children.header.children.header.children.key.props.labelKey",
    //         "TL_APPLY_RENEW_LEGACY_TRADELICENSE"
    //       );
    //     }
    //     dispatch(prepareFinalObject("Licenses[0].tradeLicensePeriod", null));
    //     dispatch(prepareFinalObject("Licenses[0].validTo", null));

    //   }
    // }
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    return action;
    }
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...header
            }
          }
        },
        stepper,
        formwizardFirstStep,
        formwizardSecondStep,
        formwizardThirdStep,
        formwizardFourthStep,
        formwizardFifthStep,
        formwizardSixthStep,
        footer
      }
    },
    breakUpDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-tradelicence",
      componentPath: "ViewBreakupContainer",
      props: {
        open: false,
        maxWidth: "md",
        screenKey: "apply"
      }
    }
  }
};

export default screenConfig;