export const cleanChargeTagId = async (rawChargeTagId) => {
    let idTag = rawChargeTagId;

    // KEBA adds the serial to the idTag ("<idTag>_<serial>") => cut off suffix
    if (rawChargeTagId && rawChargeTagId.trim() !== "") {
        const sep = rawChargeTagId.indexOf("_");
        if (sep >= 0) {
            idTag = rawChargeTagId.substring(0, sep);
        }
    }

    return idTag;
};
