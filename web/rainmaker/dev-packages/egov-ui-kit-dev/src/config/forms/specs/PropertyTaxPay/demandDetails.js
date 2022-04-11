import { mohalla } from "egov-ui-kit/config/forms/specs/PropertyTaxPay/utils/reusableFields";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { fetchGeneralMDMSData, prepareFormData } from "egov-ui-kit/redux/common/actions";
import { setFieldProperty } from "egov-ui-kit/redux/form/actions";
import { fetchDropdownData, generalMDMSDataRequestObj, getGeneralMDMSDataDropdownName, getTranslatedLabel } from "egov-ui-kit/utils/commons";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import filter from "lodash/filter";
import get from "lodash/get";
import sortBy from "lodash/sortBy";
import { prepareFinalObject } from "../../../../../../../packages/lib/egov-ui-framework/ui-redux/screen-configuration/actions";
import set from "lodash/set";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const formConfig = {
  name: "demandDetails",
  fields: {
    holdingTax: {
      id: "holding-tax",
      jsonPath: "Properties[0].additionalDetails.holdingTax",
      type: "textfield",
      floatingLabelText: "PT_HOLDING_TAX",
      hintText: "PT_HOLDING_TAX_PLACEHOLDER",
      numcols: 6,
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      errorMessage: "PT_HOLDING_TAX_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          if(key == "usageExemption" || key == "ownershipExemption"){
            amountArray.push(Number(-value))
          }else if((key !== "previousPropertyUuid") && (key !== 'isRainwaterHarvesting') && (key !== 'pendingFrom')){
            amountArray.push(Number(value))
          }
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total.toFixed(2)));
      }
    },
    lightTax: {
      id: "ligth-tax",
      jsonPath: "Properties[0].additionalDetails.lightTax",
      type: "textfield",
      floatingLabelText: "PT_LIGHT_TAX",
      hintText: "PT_LIGHT_TAX_PLACEHOLDER",
      numcols: 6,
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      errorMessage: "PT_LIGHT_TAX_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          if(key == "usageExemption" || key == "ownershipExemption"){
            amountArray.push(Number(-value))
          }else if((key !== "previousPropertyUuid") && (key !== 'isRainwaterHarvesting') && (key !== 'pendingFrom')){
            amountArray.push(Number(value))
          }
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total.toFixed(2)));
      }
    },
    waterTax: {
      id: "water-tax",
      jsonPath: "Properties[0].additionalDetails.waterTax",
      type: "textfield",
      floatingLabelText: "PT_WATER_TAX",
      hintText: "PT_WATER_TAX_PLACEHOLDER",
      numcols: 6,
      errorMessage: "PT_WATER_TAX_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          if(key == "usageExemption" || key == "ownershipExemption"){
            amountArray.push(Number(-value))
          }else if((key !== "previousPropertyUuid") && (key !== 'isRainwaterHarvesting') && (key !== 'pendingFrom')){
            amountArray.push(Number(value))
          }
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total.toFixed(2)));
      }
    },
    drainageTax: {
      id: "drainage-tax",
      jsonPath: "Properties[0].additionalDetails.drainageTax",
      type: "textfield",
      floatingLabelText: "PT_DRAINAGE_TAX",
      hintText: "PT_DRAINAGE_TAX_PLACEHOLDER",
      numcols: 6,
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      errorMessage: "PT_DRAINAGE_TAX_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          if(key == "usageExemption" || key == "ownershipExemption"){
            amountArray.push(Number(-value))
          }else if((key !== "previousPropertyUuid") && (key !== 'isRainwaterHarvesting') && (key !== 'pendingFrom')){
            amountArray.push(Number(value))
          }
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total.toFixed(2)));
      }
    },
    latrineTax: {
      id: "latrine-tax",
      jsonPath: "Properties[0].additionalDetails.latrineTax",
      type: "textfield",
      floatingLabelText: "PT_LATRINE_TAX",
      hintText: "PT_LATRINE_TAX_PLACEHOLDER",
      numcols: 6,
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      errorMessage: "PT_LATRINE_TAX_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          if(key == "usageExemption" || key == "ownershipExemption"){
            amountArray.push(Number(-value))
          }else if((key !== "previousPropertyUuid") && (key !== 'isRainwaterHarvesting') && (key !== 'pendingFrom')){
            amountArray.push(Number(value))
          }
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total.toFixed(2)));
      }
    },
    parkingTax: {
      id: "parking-tax",
      jsonPath: "Properties[0].additionalDetails.parkingTax",
      type: "textfield",
      floatingLabelText: "PT_PARKING_TAX",
      hintText: "PT_PARKING_TAX_PLACEHOLDER",
      numcols: 6,
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      errorMessage: "PT_PARKING_TAX_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          if(key == "usageExemption" || key == "ownershipExemption"){
            amountArray.push(Number(-value))
          }else if((key !== "previousPropertyUuid") && (key !== 'isRainwaterHarvesting') && (key !== 'pendingFrom')){
            amountArray.push(Number(value))
          }
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total.toFixed(2)));
      }
    },
    solidWasteUserCharges: {
      id: "solidwaste-charges",
      jsonPath: "Properties[0].additionalDetails.solidWasteUserCharges",
      type: "textfield",
      floatingLabelText: "PT_SOLID_WASTER_USER_CHARGES",
      hintText: "PT_SOLID_WASTER_USER_CHARGES_PLACEHOLDER",
      numcols: 6,
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      errorMessage: "PT_SOLID_WASTER_USER_CHARGES_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          if(key == "usageExemption" || key == "ownershipExemption"){
            amountArray.push(Number(-value))
          }else if((key !== "previousPropertyUuid") && (key !== 'isRainwaterHarvesting') && (key !== 'pendingFrom')){
            amountArray.push(Number(value))
          }
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total.toFixed(2)));
      }
    },
    ownershipExemption: {
      id: "ownership-exemption",
      jsonPath: "Properties[0].additionalDetails.ownershipExemption",
      type: "textfield",
      floatingLabelText: "PT_OWNERSHIP_EXEMPTION",
      hintText: "PT_OWNERSHIP_EXEMPTION_PLACEHOLDER",
      numcols: 6,
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      errorMessage: "PT_OWNERSHIP_EXEMPTION_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          if(key == "usageExemption" || key == "ownershipExemption"){
            amountArray.push(Number(-value))
          }else if((key !== "previousPropertyUuid") && (key !== 'isRainwaterHarvesting') && (key !== 'pendingFrom')){
            amountArray.push(Number(value))
          }
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total.toFixed(2)));
      }
    },
    usageExemption: {
      id: "usage-exemption",
      jsonPath: "Properties[0].additionalDetails.usageExemption",
      type: "textfield",
      floatingLabelText: "PT_USAGE_EXEMPTION",
      hintText: "PT_USAGE_EXEMPTION_PLACEHOLDER",
      numcols: 6,
      errorMessage: "PT_USAGE_EXEMPTION_ERRORMSG",
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          if(key == "usageExemption" || key == "ownershipExemption"){
            amountArray.push(Number(-value))
          }else if((key !== "previousPropertyUuid") && (key !== 'isRainwaterHarvesting') && (key !== 'pendingFrom')){
            amountArray.push(Number(value))
          }
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total.toFixed(2)));
      }
    },
    interest: {
      id: "interest",
      jsonPath: "Properties[0].additionalDetails.interest",
      type: "textfield",
      floatingLabelText: "PT_INTEREST",
      hintText: "PT_INTEREST_PLACEHOLDER",
      numcols: 6,
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      errorMessage: "PT_INTEREST_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          if(key == "usageExemption" || key == "ownershipExemption"){
            amountArray.push(Number(-value))
          }else if((key !== "previousPropertyUuid") && (key !== 'isRainwaterHarvesting') && (key !== 'pendingFrom')){
            amountArray.push(Number(value))
          }
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total.toFixed(2)));
      }
    },
    penalty: {
      id: "penalty",
      jsonPath: "Properties[0].additionalDetails.penalty",
      type: "textfield",
      floatingLabelText: "PT_PENALTY",
      hintText: "PT_PENALTY_PLACEHOLDER",
      numcols: 6,
      errorMessage: "PT_PENALTY_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          if(key == "usageExemption" || key == "ownershipExemption"){
            amountArray.push(Number(-value))
          }else if((key !== "previousPropertyUuid") && (key !== 'isRainwaterHarvesting') && (key !== 'pendingFrom')){
            amountArray.push(Number(value))
          }
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total.toFixed(2)),0);
      }
    },
    serviceTax: {
      id: "serviceTax",
      jsonPath: "Properties[0].additionalDetails.serviceTax",
      type: "textfield",
      floatingLabelText: "PT_PROPERTY_SERVICETAX",
      hintText: "PT_PROPERTY_SERVICETAX_PLACEHOLDER",
      numcols: 6,
      errorMessage: "PT_PROPERTY_SERVICETAX_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          if(key == "usageExemption" || key == "ownershipExemption"){
            amountArray.push(Number(-value))
          }else if((key !== "previousPropertyUuid") && (key !== 'isRainwaterHarvesting') && (key !== 'pendingFrom')){
            amountArray.push(Number(value))
          }
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total.toFixed(2)),0);
      }
    },
    otherDues: {
      id: "otherDues",
      jsonPath: "Properties[0].additionalDetails.otherDues",
      type: "textfield",
      floatingLabelText: "PT_PROPERTY_OTHERDUES",
      hintText: "PT_PROPERTY_OTHERDUES_PLACEHOLDER",
      numcols: 6,
      errorMessage: "PT_PROPERTY_OTHERDUES_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      // pattern: /^[1-9]\d*(?:\.\d+)?$/,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        if(field && field.value && field.value != " " && field.value != 0){
          dispatch(setFieldProperty("demandDetails", "pendingFrom", "disabled", false)); 
          dispatch(setFieldProperty("demandDetails", "pendingFrom", "visible", true)); 
        }else{
          dispatch(setFieldProperty("demandDetails", "pendingFrom", "disabled", true));
        }
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          if(key == "usageExemption" || key == "ownershipExemption"){
            amountArray.push(Number(-value))
          }else if((key !== "previousPropertyUuid") && (key !== 'isRainwaterHarvesting') && (key !== 'pendingFrom')){
            amountArray.push(Number(value))
          }
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total.toFixed(2)),0);
      }
    },
    pendingFrom: {
      id: "pendingFrom",
      jsonPath: "Properties[0].additionalDetails.pendingFrom",
      type: "textfield",
      floatingLabelText: "PT_PROPERTY_PENDINGFROM",
      hintText: "PT_PROPERTY_PENDINGFROM_PLACEHOLDER",
      numcols: 6,
      errorMessage: "PT_PROPERTY_PENDINGFROM_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      pattern: /^[^*|\":<>[\]{}`\\()';@&$#!]+$/,
      required: false,
      visible:false,
      disabled:true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
         
      }
    },
    totalAmount: {
      id: "totalAmount",
      jsonPath: "Properties[0].additionalDetails.totalAmount",
      type: "textfield",
      floatingLabelText: "PT_TOTAL_AMOUNT",
      hintText: "PT_TOTAL_AMOUNT_PLACEHOLDER",
      numcols: 6,
      errorMessage: "PT_TOTAL_AMOUNT_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      pattern: /^[1-9]\d*(?:\.\d+)?$/
    }  
  },
  afterInitForm: (action, store, dispatch) => {
    try{
      const mode = getQueryArg(window.location.href, "mode");
      if(mode == "editDemandDetails" || mode == "WORKFLOWEDIT"){
        let state = store.getState();
        const additionalDetails = mode == "editDemandDetails" ? state.screenConfiguration.preparedFinalObject.Properties && state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails :
        mode == "WORKFLOWEDIT" ? state.screenConfiguration.preparedFinalObject.newProperties && state.screenConfiguration.preparedFinalObject.newProperties[0].additionalDetails : {}
        if(additionalDetails && additionalDetails.hasOwnProperty('otherDues') && additionalDetails.otherDues && additionalDetails.otherDues != '' && additionalDetails.otherDues != 0){
          dispatch(setFieldProperty("demandDetails", "pendingFrom", "disabled", false)); 
        }else{
          dispatch(setFieldProperty("demandDetails", "pendingFrom", "disabled", true)); 
        }
        if(additionalDetails && additionalDetails.hasOwnProperty('holdingTax')){
          let amountArray = []
          for (const [key, value] of Object.entries(additionalDetails)) {
            if(key == "usageExemption" || key == "ownershipExemption"){
              amountArray.push(Number(-value))
            }else if((key !== "previousPropertyUuid") && (key !== 'isRainwaterHarvesting') && (key !== 'pendingFrom')){
              amountArray.push(Number(value))
            }
          }
          const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total.toFixed(2)),"0");
          dispatch(setFieldProperty("demandDetails", "holdingTax", "value", additionalDetails.holdingTax),"0");
          dispatch(setFieldProperty("demandDetails", "lightTax", "value", additionalDetails.lightTax),"0")
          dispatch(setFieldProperty("demandDetails", "waterTax", "value", additionalDetails.waterTax),"0")
          dispatch(setFieldProperty("demandDetails", "drainageTax", "value", additionalDetails.drainageTax),"0")
          dispatch(setFieldProperty("demandDetails", "latrineTax", "value", additionalDetails.latrineTax),"0")
          dispatch(setFieldProperty("demandDetails", "parkingTax", "value", additionalDetails.parkingTax),"0")
          dispatch(setFieldProperty("demandDetails", "solidWasteUserCharges", "value", additionalDetails.solidWasteUserCharges),"0")
          dispatch(setFieldProperty("demandDetails", "ownershipExemption", "value", additionalDetails.ownershipExemption),"0")
          dispatch(setFieldProperty("demandDetails", "usageExemption", "value", additionalDetails.usageExemption),"0")
          dispatch(setFieldProperty("demandDetails", "interest", "value", additionalDetails.interest),"0")
          dispatch(setFieldProperty("demandDetails", "penalty", "value", additionalDetails.penalty),"0")   
          dispatch(setFieldProperty("demandDetails", "serviceTax", "value", additionalDetails.serviceTax),"0") 
          dispatch(setFieldProperty("demandDetails", "otherDues", "value", additionalDetails.otherDues),"0")    
      }
      
      }
    }catch(err){
      console.log(err)
    }
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
  isFormValid: false,
};

export default formConfig;
