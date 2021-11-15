import commonConfig from "config/common.js";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "egov-ui-framework/ui-redux/store";
import { appendModulePrefix } from "egov-ui-framework/ui-utils/commons";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons.js";
import { set, get } from "lodash";
import { getFromObject } from "../PTCommon/FormWizardUtils/formUtils";
import pdfMake from "pdfmake/build/pdfmake";
import logoNotFound from './logoNotFound.png';
import pdfFonts from "./vfs_fonts";
import { httpRequest } from "../api";
// const getLogoUrl = (tenantId)=>{
//     let logoUrl=`/${commonConfig.tenantId}-egov-assets/${tenantId}/logo.png`;
//     const state=store.getState()||{};
//     const {common={}}=state;
//     const {cities=[]}=common;
//     cities.map(city=>{if(city.code==tenantId){
//         logoUrl=city.logoId;
//     }})
//     return logoUrl;
// }

const vfs = { ...pdfFonts.vfs }
const font = {
    Camby: {
        normal: 'Cambay-Regular.ttf',
        bold: 'Cambay-Regular.ttf',
        italics: 'Roboto-Regular.ttf',
        bolditalics: 'Cambay-Regular.ttf',

    },
    Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Regular.ttf',
        italics: 'Roboto-Regular.ttf',
        bolditalics: 'Roboto-Regular.ttf',
    }
};
pdfMake.vfs = vfs;
pdfMake.fonts = font;
const getLabel = (value, type = 'key') => {
    let label = {}
    switch (type) {
        case 'key':
            label = {
                "text": value ? value : 'NA',
                "style": "pdf-card-key",
                "border": [
                    false,
                    false,
                    false,
                    false
                ]
            }
            break;
        case 'value':
            label = {
                "text": value ? value : 'NA',
                "style": "pdf-card-value",
                "border": [
                    false,
                    false,
                    false,
                    false
                ]
            }
            break;

        case 'header':
            label = {
                "text": value ? value : ' ',
                "style": "pdf-card-sub-header",
                "border": [
                    false,
                    false,
                    false,
                    false
                ]
            }
            break;
        case 'totalAmount':
            label = {
                "text": value ? value : ' ',
                "style": "pdf-card-sub-header",
                "border": [
                    false,
                    true,
                    false,
                    false
                ]
            }
            break;
        case 'amount':
            label = {
                "text": value ? value : ' ',
                "style": "pdf-application-no",
                "border": [
                    false,
                    false,
                    false,
                    false
                ]
            }
            break;
        default:
            label = {
                "text": value ? value : ' ',
                "style": "pdf-card-key",
                "border": [
                    false,
                    false,
                    false,
                    false
                ]
            }
    }

    return label;
}
const getMultiCard = (items = [], color = 'grey') => {
    let card = []

    items.map(item => {
        if (item.header) {
            let row = []
            row.push(getLabel(getLocaleLabels(item.header, item.header), 'header'))
            for (let i = 0; i < 3; i++) {
                row.push(getLabel(' ', 'header'))
            }
            card.push(row);
        }
        const newCard = getCard(item.items, color);
        card.push(...newCard.stack[0].table.body);
    })

    let tableCard = {
        "style": color == "grey" ? "pdf-table-card" : "pdf-table-card-white",
        "table": {
            "widths": [
                125,
                125,
                125,
                125
            ],
            "body": [...card]
        },
        "layout": {}
    }
    return tableCard;
}
const getHeader = (header) => {
    let cardWithHeader = header ? [{
        "text": header == '-1' ? " " : getLocaleLabels(header, header),
        "style": header == '-1' ? "pdf-card-no-title" : "pdf-card-title"
    }] : [];

    return cardWithHeader;
}
const getCard = (keyValues = [], color = 'grey') => {
    let card = []
    let keys = [];
    let values = [];
    keyValues.map(keyValue => {
        keys.push(getLabel(keyValue.key, 'key'));
        values.push(getLabel(keyValue.value, 'value'))
        if (keys.length == 4 && values.length == 4) {
            card.push([...keys]);
            card.push([...values]);
            keys = [];
            values = [];
        }
    })
    if (keys.length != 0 && values.length != 0) {
        for (let i = keys.length; i < 4; i++) {
            keys.push(getLabel(' ', 'key'));
            values.push(getLabel(' ', 'value'))
        }
        card.push([...keys]);
        card.push([...values]);
    }
    let tableCard = {

        stack: [
            {
                ...getCustomCard([...card], [
                    125,
                    125,
                    125,
                    125
                ], {}, color)
            }
        ]
    }
    return tableCard;
}
const getCardWithHeader = (header, keyValue, color) => {
    let cardWithHeader = header ? [{
        "text": header == '-1' ? " " : getLocaleLabels(header, header),
        "style": header == '-1' ? "pdf-card-no-title" : "pdf-card-title"
    }] : [];
    cardWithHeader.push(getCard(keyValue, color))
    return cardWithHeader;
}
const getMultiItemCard = (header, items, color = 'grey') => {
    let cardWithHeader = header ? [{
        "text": getLocaleLabels(header, header),
        "style": "pdf-card-title"
    }] : [];

    cardWithHeader.push(getMultiCard(items, color))
    return cardWithHeader;
}

export const getMultiItems = (preparedFinalObject, cardInfo, sourceArrayJsonPath) => {
    let multiItem = [];
    let removedElements = [];
    const arrayLength = getFromObject(preparedFinalObject, sourceArrayJsonPath, []).length;
    for (let i = 0; i < arrayLength; i++) {
        let items = [];
        items = generateKeyValue(preparedFinalObject, cardInfo);
        let sourceArray = getFromObject(preparedFinalObject, sourceArrayJsonPath, []);
        removedElements.push(sourceArray.shift());
        set(preparedFinalObject, sourceArrayJsonPath, sourceArray);
        multiItem.push({ items });
    }
    set(preparedFinalObject, sourceArrayJsonPath, removedElements);
    return multiItem;
}
export const getMultipleItemCard = (itemsInfo, itemHeader = "COMMON_OWNER", hideHeader = false) => {
    let multipleItems = (itemsInfo && itemsInfo.length && itemsInfo[0].items.filter(item => item)) || [];
    if (itemsInfo.length > 1) {
        let items = [];
        itemsInfo.map((item, index) => {
            let rowElements = { header: `${getLocaleLabels(itemHeader, itemHeader)} - ${index + 1}`, items: item.items.filter(element => element) };
            if (hideHeader) {
                delete rowElements.header;
            }
            items.push(rowElements)
        })
        multipleItems = items
    }
    return multipleItems;
}
export const getDocumentsCard = (documentsUploadRedux) => {
    return documentsUploadRedux.map(item => {
        return { key: getLocaleLabels(item.title, item.title), value: item.name }
    })
}



export const generateKeyValue = (preparedFinalObject, containerObject) => {
    let keyValue = []
    Object.keys(containerObject).map(keys => {
        const labelObject = getFromObject(containerObject[keys], 'children.label.children.key.props', getFromObject(containerObject[keys], 'children.label1.children.key.props', {}));
        const key = getLocaleLabels(labelObject.labelName, labelObject.labelKey)
        const valueObject = getFromObject(containerObject[keys], 'children.value.children.key.props', getFromObject(containerObject[keys], 'children.value1.children.key.props', {}));
        let value = valueObject.callBack && typeof valueObject.callBack == "function" ? valueObject.callBack(getFromObject(preparedFinalObject, valueObject.jsonPath, '')) : getFromObject(preparedFinalObject, valueObject.jsonPath, '');
        value = value !== 'NA' && valueObject.localePrefix ? appendModulePrefix(value, valueObject.localePrefix) : value;
        value = containerObject[keys].localiseValue ? getLocaleLabels(value, value) : value;
        keyValue.push({ key, value });
    })
    return keyValue;
}
export const generateKeyValueForModify = (preparedFinalObject, containerObject) => {
    let keyValue = []
    Object.keys(containerObject).map(keys => {
        const labelObject = containerObject[keys].children.label1.children.key.props;
        const key = getLocaleLabels(labelObject.labelName, labelObject.labelKey)
        const valueObject = containerObject[keys].children.value1.children.key.props;
        let value = valueObject.callBack && typeof valueObject.callBack == "function" ? valueObject.callBack(getFromObject(preparedFinalObject, valueObject.jsonPath, '')) : getFromObject(preparedFinalObject, valueObject.jsonPath, '');
        value = value !== 'NA' && valueObject.localePrefix ? appendModulePrefix(value, valueObject.localePrefix) : value;
        value = containerObject[keys].localiseValue ? getLocaleLabels(value, value) : value;
        keyValue.push({ key, value });
    })
    return keyValue;
}

let tableborder = {
    hLineColor: function (i, node) {
        return "#979797";
    },
    vLineColor: function (i, node) {
        return "#979797";
    },
    hLineWidth: function (i, node) {
        return 0.5;
    },
    vLineWidth: function (i, node) {
        return 0.5;
    },
};


const getCustomCard = (body = [], width = [], layout = {}, color = 'grey') => {
    return {
        "style": color == "grey" ? "pdf-table-card" : "pdf-table-card-white",
        "table": {
            widths: width,
            "body": body
        },
        "layout": layout
    }
}
const totalAmount = (arr) => {
    return arr
        .map(item => (item.value && !isNaN(Number(item.value)) ? Number(item.value) : 0))
        .reduce((prev, next) => prev + next, 0);
}
export const getEstimateCardDetails = (fees = [], color, firstRowEnable = true, lastRowEnable = true, customForBillamend = false) => {
    let estimateCard = {};

    let total = 0;
    if (firstRowEnable || lastRowEnable) {
        total = totalAmount(fees);
    }


    let card = [];
    let row1 = []

    let row2 = []

    if (firstRowEnable) {
        row1.push(getLabel(' ', 'amount'))
        row1.push(getLabel(' ', 'amount'))
        row1.push({ ...getLabel(getLocaleLabels('TL_COMMON_TOTAL_AMT', 'TL_COMMON_TOTAL_AMT'), 'amount'), "alignment": "right" })
        card.push(row1);
        row2.push(getLabel(' ', 'amount'))
        row2.push(getLabel(' ', 'amount'))
        row2.push({ ...getLabel(customForBillamend ? getLocaleLabels(total) : total, 'amount'), style: "pdf-application-no-value", "alignment": "right" })
        card.push(row2);
    }



    let rowLast = []


    fees.map((fee, i) => {
        let row = []

        if (customForBillamend) {
            row.push(getLabel(getLocaleLabels(fee.name.labelName, fee.name.labelKey), i == 0 ? "value" : 'header'))
            row.push(getLabel(' ', 'header'));
            row.push({ ...getLabel(customForBillamend ? getLocaleLabels(fee.value) : fee.value, i == 0 ? "value" : 'header'), "alignment": "right" })
            // customForBillamend?{}:row.push(getLabel(' ', 'header')) ;
        } else {
            row.push(getLabel(getLocaleLabels(fee.name.labelName, fee.name.labelKey), 'header'))
            row.push({ ...getLabel(fee.value, 'header'), "alignment": "right" })
            row.push(getLabel(' ', 'header'));
        }

        card.push(row);
    })
    if (lastRowEnable) {
        rowLast.push(getLabel(getLocaleLabels('TL_COMMON_TOTAL_AMT', 'TL_COMMON_TOTAL_AMT'), 'totalAmount'))
        customForBillamend ? rowLast.push(getLabel(' ', 'totalAmount')) : {}
        rowLast.push({ ...getLabel(total, 'totalAmount'), "alignment": "right" })
        customForBillamend ? {} : rowLast.push(getLabel(' ', 'header'));
        card.push(rowLast);
    }


    estimateCard = getCustomCard(card, [250, 150, 108], tableborder, color)

    return estimateCard;
}

export const loadUlbLogo = tenantid => {
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
        var canvas = document.createElement("CANVAS");
        var ctx = canvas.getContext("2d");
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        store.dispatch(
            prepareFinalObject("UlbLogoForPdf", canvas.toDataURL())
        );
        localStorage.setItem("UlbLogoForPdf", canvas.toDataURL());
        canvas = null;
    };
    img.src = `/${commonConfig.tenantId}-egov-assets/${tenantid}/logo.png`;
};

const getHeaderCard =  (applicationData, logo, logoHeaderEndingTitle = "") => {
    if (applicationData && applicationData.module == 'marriageregistration')
        logo = "data:image/png;base64,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";
    let applicationHeader = {
        style: applicationData.qrcode ? "pdf-head-qr-code" : "pdf-header",
        table: {
            widths: applicationData.qrcode ? [120, "*", 120] : [120, "*", 40],
            body: []
        },
        layout: "noBorders"
    }
    let body = [];
    logo = logo != null && logo || logoNotFound;
    body.push({
        image: logo,
        width: 60,
        height: 61.25,
        margin: [51, 12, 10, 10]
    })
    body.push({
        stack: [
            {
                //text: applicationData && applicationData.module == 'marriageregistration' ? applicationData.logoHeaderTitleEnding : getLocaleLabels(("TENANT_TENANTS_" + applicationData.tenantId.replace('.', '_')).toUpperCase(), ("TENANT_TENANTS_" + applicationData.tenantId.replace('.', '_')).toUpperCase()) + " " + getLocaleLabels(("CORPORATION", "CMN_ACK_CORPORATION_HEADER").toUpperCase(), ("CORPORATION", "CMN_ACK_CORPORATION_HEADER").toUpperCase()),
                text: logoHeaderEndingTitle,
                style: "pdf-header-text"
            },
            {
                text: getLocaleLabels(applicationData.header, applicationData.header) || "",
                style: "pdf-header-sub-text",
            }
        ],
        alignment: "left",
        margin: [10, 13, 0, 0]
    });
    if (applicationData.qrcode) {
        body.push({
            image: applicationData.qrcode,
            width: 70,
            height: 70,
            margin: [50, 8, 8, 8],
            alignment: "right"
        })
    }

    applicationHeader.table.body.push(body)
    return applicationHeader

}
export const generatePDF = async (logo, applicationData = {}, fileName, isCustomforBillamend = false) => {

    var payload = null;
    var logoHeaderEndingTitle = "";
    let mdmsBody = {
        MdmsCriteria: {
            tenantId: "od",
            moduleDetails: [

                {
                    moduleName: "tenant",
                    masterDetails: [
                        {
                            name: "tenants",
                            filter: `[?(@.code=="${applicationData.tenantId}")]`
                        },
                    ],
                }
            ]
        }
    };
    try {
        
        payload = await httpRequest(
            "/egov-mdms-service/v1/_search",
            "_search",
            [],
            mdmsBody,

          );

          let appTenantInfo = get(payload.MdmsRes, "tenant.tenants[0]");
          logoHeaderEndingTitle = appTenantInfo.city.name+" "+appTenantInfo.city.ulbGrade
    } catch (e) {
        console.log(e);
    }

    logo = logo || localStorage.getItem("UlbLogoForPdf");
    let data;
    let tableborder = {
        hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 0.1 : 0.1;
        },
        vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 0.1 : 0.1;
        },
        hLineColor: function (i, node) {
            return i === 0 || i === node.table.body.length ? "#979797" : "#979797";
        },
        vLineColor: function (i, node) {
            return i === 0 || i === node.table.widths.length ? "#979797" : "#979797";
        },
    };


    let borderKey = [true, true, false, true];
    let borderValue = [false, true, true, true];
    let receiptTableWidth = ["*", "*", "*", "*"];

    data = {
        defaultStyle: {
            font: "Camby"
        },
        content: [

            { ...getHeaderCard(applicationData, logo, logoHeaderEndingTitle) }
            ,
            {
                "style": "pdf-application-no",
                "columns": [
                    {
                        "text": [
                            {
                                "text": applicationData.applicationNoHeader ? getLocaleLabels(applicationData.applicationNoHeader, applicationData.applicationNoHeader) + ' ' : '',
                                bold: true
                            },
                            {
                                "text": applicationData.applicationNoValue ? getLocaleLabels(applicationData.applicationNoValue, applicationData.applicationNoValue) : '',
                                italics: true,
                                "style": "pdf-application-no-value"
                            }
                        ],
                        "alignment": "left"
                    },
                    {
                        "text": [
                            {
                                "text": applicationData.additionalHeader ? getLocaleLabels(applicationData.additionalHeader, applicationData.additionalHeader) + ' ' : '',
                                bold: true
                            },
                            {
                                "text": applicationData.additionalHeaderValue ? getLocaleLabels(applicationData.additionalHeaderValue, applicationData.additionalHeaderValue) : '',
                                italics: true,
                                "style": "pdf-application-no-value"
                            }
                        ],
                        "alignment": "right"
                    }
                ]
            }
        ],
        pageBreakBefore: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
            //check if signature part is completely on the last page, add pagebreak if not

            let nodeLength = followingNodesOnPage.length;
            followingNodesOnPage.map((node, ind) => {
                if (node.style == 'pdf-table-card') {
                    nodeLength = ind;
                }
            })
            if (currentNode.startPosition.verticalRatio > 0.80 && currentNode.style == 'pdf-card-title') {
                return true;
            }
            if (currentNode.startPosition.verticalRatio > 0.75 && currentNode.style == 'pdf-card-title' && nodeLength > 19) {
                return true;
            }
            return false;
        },
        styles: {
            "pdf-header": {
                "fillColor": "#F2F2F2",
                "margin": [
                    -70,
                    -41,
                    -81,
                    10
                ]
            },
            "pdf-application-no-value": {
                "fontSize": isCustomforBillamend ? 11 : 12,
                "font": "Roboto",
                italics: true,
                "margin": [
                    -18,
                    8,
                    0,
                    0
                ],
                "color": "#484848"
            },
            "pdf-header-text": {
                "color": "#484848",
                "fontSize": 20,
                bold: true,
                "letterSpacing": 0.74,
                "margin": [
                    0,
                    0,
                    0,
                    5
                ]
            },
            "pdf-header-sub-text": {
                "color": "#484848",
                "fontSize": 15,
                "letterSpacing": 0.6
            },
            "pdf-application-no": {
                "fontSize": isCustomforBillamend ? 9 : 12,
                bold: true,
                "margin": [
                    -18,
                    8,
                    0,
                    0
                ],
                "color": "#484848"
            },
            "pdf-card-title": {
                "fontSize": 11,
                bold: true,
                "margin": [
                    -18,
                    16,
                    8,
                    8
                ],
                "color": "#484848",
                "fontWeight": 500
            },
            "pdf-card-no-title": {
                "fontSize": 11,
                bold: true,
                "color": "#484848",
                "fontWeight": 500
            },
            "pdf-table-card-white": {
                "fillColor": "white",
                "fontSize": 7,
                "color": "#484848",
                "margin": [
                    -20,
                    -2,
                    -8,
                    -8
                ]
            },
            "pdf-table-card": {
                "fillColor": "#F2F2F2",
                "fontSize": 7,
                "color": "#484848",
                "margin": [
                    -20,
                    -2,
                    -8,
                    -8
                ]
            },
            "pdf-card-key": {
                "color": "rgba(0, 0, 0, 0.54)",
                "fontSize": 8,
                "margin": [
                    0,
                    1,
                    0,
                    0
                ]
            },
            "pdf-card-sub-header": {
                "color": "rgba(0, 0, 0, 0.94)",
                "fontSize": 9,
                bold: true,
                "margin": [
                    0,
                    3,
                    0,
                    0
                ]
            },
            "pdf-card-value": {
                "fontSize": 10,
                "color": "rgba(0, 0, 0, 0.87)",
                "margin": [
                    0,
                    0,
                    0,
                    1
                ]
            },
            "pdf-head-qr-code": {
                fillColor: "#F2F2F2",
                margin: [-70, -41, -81, 0]
            },
        },
    };
    applicationData.cards.map(card => {
        switch (card.type) {
            case "singleItem":
                if (!card.hide && card.items && card.items.length) {
                    data.content.push(...getCardWithHeader(card.header, card.items, card.color));
                }
                break;
            case "header":
                if (!card.hide && card.header) {
                    data.content.push(...getHeader(card.header));
                }
                break;
            case "multiItem":
                if (!card.hide && card.items && card.items.length) {
                    data.content.push(...getMultiItemCard(card.header, card.items, card.color));
                }
                break;
            case "estimate":
                if (!card.hide && card.items && card.items) {
                    data.content.push({ ...card.items });
                }
                break;
            default:
                if (!card.hide && card.items && card.items.length) {
                    data.content.push(...getCardWithHeader(card.header, card.items, card.color));
                }
        }
    })

    pdfMake.vfs = vfs;
    pdfMake.fonts = font;
    try {
        if (fileName != 'print') {
            const pdfData = pdfMake.createPdf(data);
            downloadPDFFileUsingBase64(pdfData, fileName);
        } else {
            const pdfData = pdfMake.createPdf(data);
            printPDFFileUsingBase64(pdfData, fileName);
            // data && pdfMake.createPdf(data).open();
        }
    } catch (e) {
        console.log(JSON.stringify(data), 'pdfdata');
        console.log('error in generating pdf', e);
    }

};

const mobileCheck = () => {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};


export const downloadPDFFileUsingBase64 = (receiptPDF, filename) => {
    if (typeof mSewaApp === "undefined" && !mobileCheck()) {
        // we are running in browser
        receiptPDF.download(filename);
    } else {
        // we are running under webview
        receiptPDF.getBase64(data => {
            mSewaApp.downloadBase64File(data, filename);
        });
    }
}

export const openPDFFileUsingBase64 = (receiptPDF, filename) => {
    if (typeof mSewaApp === "undefined" && !mobileCheck()) {
        // we are running in browser
        receiptPDF.open();
    } else {
        // we are running under webview
        receiptPDF.getBase64(data => {
            mSewaApp.downloadBase64File(data, filename);
        });
    }
}

export const printPDFFileUsingBase64 = (receiptPDF, filename) => {
    if (typeof mSewaApp === "undefined" && !mobileCheck()) {
        // we are running in browser
        receiptPDF.print();
    } else {
        // we are running under webview
        receiptPDF.getBase64(data => {
            mSewaApp.downloadBase64File(data, filename);
        });
    }
}

