import { getSearchResults } from "../../../../../ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import commonConfig from "config/common.js";

const getMdmsData = async () => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [{ name: "citymodule" }]
        }
      ]
    }
  };
  try {
    let payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    return payload;
  } catch (e) {
    console.log(e);
  }
};
export const fetchData = async (action, state, dispatch) => {
  const response = await getSearchResults();
  const mdmsRes = await getMdmsData(dispatch);
  let tenants =
    mdmsRes &&
    mdmsRes.MdmsRes &&
    mdmsRes.MdmsRes.tenant.citymodule.find(item => {
      if (item.code === "MR") return true;
    });
  dispatch(
    prepareFinalObject(
      "applyScreenMdmsData.common-masters.citiesByModule.MR",
      tenants
    )
  );
  try {
    /*Mseva 1.0 */
    // let data =
    //   response &&
    //   response.Licenses.map(item => ({
    //     [get(textToLocalMapping, "Application No")]:
    //       item.applicationNumber || "-",
    //     [get(textToLocalMapping, "License No")]: item.licenseNumber || "-",
    //     [get(textToLocalMapping, "Trade Name")]: item.tradeName || "-",
    //     [get(textToLocalMapping, "Owner Name")]:
    //       item.tradeLicenseDetail.owners[0].name || "-",
    //     [get(textToLocalMapping, "Application Date")]:
    //       convertEpochToDate(item.applicationDate) || "-",
    //     tenantId: item.tenantId,
    //     [get(textToLocalMapping, "Status")]:
    //       get(textToLocalMapping, item.status) || "-"
    //   }));

    // dispatch(
    //   handleField(
    //     "home",
    //     "components.div.children.applyCard.children.searchResults",
    //     "props.data",
    //     data
    //   )
    // );
    /*Mseva 2.0 */

    if (response && response.MarriageRegistrations && response.MarriageRegistrations.length > 0) {
      dispatch(prepareFinalObject("searchResults", response.MarriageRegistrations));
      dispatch(
        prepareFinalObject("myApplicationsCount", response.MarriageRegistrations.length)
      );
    }
  } catch (error) {
    console.log(error);
  }
};
