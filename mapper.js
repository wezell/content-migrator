const translationMap = function(contentlet) {
    const diagramUrl = function(diagramNum) {
        if (contentlet[diagramNum] === undefined) {
            return undefined;
        }
        return "https://auth.dotcms.com/dA/" + contentlet["identifier"] + "/diagram" + diagramNum;
    }

    const relationships = function(relationshipField) {
        if (contentlet[relationshipField] === undefined || contentlet[relationshipField].length === 0) {
            return undefined;
        }
        return "+live:true +identifier:(" + contentlet[relationshipField].join(" OR ") + ")";
    
    }

    return {
        "diagram1": diagramUrl("diagram1"),
        "diagram2": diagramUrl("diagram2"),
        "diagram3": diagramUrl("diagram3"),
        "diagram4": diagramUrl("diagram4"),
        "diagram5": diagramUrl("diagram5"),
        "diagram6": diagramUrl("diagram6"),
        "diagram7": diagramUrl("diagram7"),
        "diagram8": diagramUrl("diagram8"),
        "diagram9": diagramUrl("diagram9"),
        "diagram10": diagramUrl("diagram10"),
        "diagram11": diagramUrl("diagram11"),
        "diagram12": diagramUrl("diagram12"),
        "dotcmsdocumentationchildren": relationships("dotcmsdocumentationchildren"),
        "host": contentlet.host,
        "identifier": contentlet.identifier,
        "urlTitle": contentlet.urlTitle,
        "seoDescription": contentlet.seoDescription,
        "documentation": contentlet.documentation,
        "format": contentlet.format,
        "creationDate": contentlet.creationDate,
        "folder": contentlet.folder,
        "sortOrder": contentlet.sortOrder,
        "title": contentlet.title,
        "showContentAboveChildren": contentlet.showContentAboveChildren,
        "navTitle": contentlet.navTitle,
        "languageId": contentlet.languageId,
        "modDateOverride": contentlet.modDateOverride,
        "contentType": contentlet.contentType
    }
}

export function mapContent(contentlet) {
    contentlet = typeof contentlet === "string" ? JSON.parse(contentlet) : contentlet; 

    let translated= translationMap(contentlet);

    return Object.fromEntries(Object.entries(translated).filter(([_, v]) => v != null));

}