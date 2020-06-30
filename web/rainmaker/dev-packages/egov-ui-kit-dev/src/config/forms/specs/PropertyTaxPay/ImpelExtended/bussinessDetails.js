const formConfig = {
  name: "bussinessDetails",
  fields: {
    VasikaNo: {
      id: "vasikaNo",
      jsonPath: "Properties[0].bussinessDetails[0].vasikaNo",
      type: "textfield",
      localePrefix: "VasikaNo",
      floatingLabelText: "VasikaNo",
      hintText: "VasikaNo",
      required: true,
      fullWidth: true,
      
    },
    datePicker: {
      id: "vasikaDate",
      jsonPath: "Properties[0].bussinessDetails[0].vasikaDate",
      type: "date",
      localePrefix: "Vasika Date",
      floatingLabelText: "Vasika Date",
      hintText: "Vasika Date",
      required: true,
      fullWidth: true,
      
    },
    allotmentNo: {
      id: "allotmentNo",
      jsonPath:"Properties[0].bussinessDetails[0].allotmentNo" ,
      type: "textfield",
      localePrefix: "Allotment No",
      floatingLabelText: "Allotment No",
      hintText: "Allotment No",
      required: true,
      fullWidth: true,
      
    },
    allotmentDate: {
      id: "allotmentDate",
      jsonPath: "Properties[0].bussinessDetails[0].allotmentDate",
      type: "date",
      localePrefix: "Allotment Date",
      floatingLabelText: "Allotment Date",
      hintText: "Allotment Date",
      required: true,
      fullWidth: true,
      
    },
    businessName: {
      id: "businessName",
      jsonPath:"Properties[0].bussinessDetails[0].businessName" ,
      type: "textfield",
      localePrefix: "Bussiness Name",
      floatingLabelText: "Bussiness Name",
      hintText: "Bussiness Name",
      required: true,
      fullWidth: true,
      
    },
    remrks: {
      id: "remarks",
      jsonPath: "Properties[0].bussinessDetails[0].remrks",
      type: "textfield",
      localePrefix: "Remarks",
      floatingLabelText: "Remarks",
      hintText: "Remarks",
      required: true,
      fullWidth: true,
      
    },
  }
}

export default formConfig;