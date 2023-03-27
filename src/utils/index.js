const convertToVietnamese = (text) => {
  switch (text) {
    case "lip":
      return "môi";
    case "eyes":
      return "mắt";
    case "face":
      return "mặt";
    case "eyebrows":
      return "lông mày";
    default:
      return "";
  }
};

exports.convertToVietnamese = convertToVietnamese;
