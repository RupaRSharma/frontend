import { getCommonHeader, getCommonCard, getCommonGrayCard, getCommonContainer, getCommonSubHeader, convertEpochToDate, getLabel, getLabelWithValue } from "egov-ui-framework/ui-config/screens/specs/utils";
// import get from "lodash/get";
import {getDemandSearchResult } from "../../../../ui-utils/commons";
import set from "lodash/set";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "egov-ui-kit/utils/api";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";


let consumerCode = getQueryArg(window.location.href, "propertyId");
const tenantId = getQueryArg(window.location.href, "tenantId")
const service = getQueryArg(window.location.href, "service")


export const searchApiCall = async (dispatch, consumerCode, tenantId, bService) => {
  if (consumerCode) {
    let queryObject = [{ key: "businessService", value: "PT" }, { key: "tenantId", value: tenantId }, { key: "consumerCode", value: consumerCode }]
 
    try {
    let  demandsResult = await httpRequest(
        "/billing-service/demand/_search",
        "_search",
        queryObject
      );
    
     
      if (demandsResult.Demands && demandsResult.Demands.length > 0) {
      //  dispatch(toggleSpinner());
        let demands = demandsResult.Demands;
        // demands.sort((a,b) => (a.taxPeriodFrom < b.taxPeriodFrom) ? 1 : ((b.taxPeriodFrom < a.taxPeriodFrom) ? -1 : 0))
        dispatch(prepareFinalObject("Demands", demands))
        dispatch(prepareFinalObject(
          "ptDemandsSearchScreen",
          {}
        ))
        return demands;
    }
  
    } catch (error) {
      // dispatch(toggleSpinner());
    dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelKey: error.message },
          "error"
        )
      );
      console.log(error, "fetxhffff");
    }

  }
};

const header = getCommonContainer({
  header: getCommonHeader({
    labelName: "Demands Details",
    labelKey: ""
  }),
  propertyId: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-pt",
    componentPath: "PropertyIdContainer",
    props: {
      number: getQueryArg(window.location.href, "propertyId")
    }
  },
});
const beforeInitFn = (action, state, dispatch, consumerCode, tenantId, bService)=>{
  searchApiCall( dispatch, consumerCode, tenantId, bService)
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "demand-adjust-ViewList",
  beforeInitScreen: (action, state, dispatch) => {
    let consumerCode = getQueryArg(window.location.href, "propertyId");
    let tenantId = getQueryArg(window.location.href, "tenantId");
    let bService = getQueryArg(window.location.href, "businessService");
    beforeInitFn(action, state, dispatch, consumerCode, tenantId, bService);
    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: { className: "common-div-css search-preview" },
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
        
        totalAmount:{
          uiFramework: "custom-atoms-local",
          moduleName: "egov-pt",
          componentPath: "TotalBill"
        },
        
        viewTwo: {
          uiFramework: "custom-molecules-local",
          moduleName: "egov-pt",
          componentPath: "DemandAdjustMent"
      }
        
      }
    }
  }
};

export default screenConfig;