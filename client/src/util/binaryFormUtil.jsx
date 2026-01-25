const extractBinaryFormData = (formData) => {
  let data = new FormData(formData);
  let returnData = {};

  for (let [key, val] of data.entries()) {
    returnData[key] = val;
  }
  return returnData;
};

export default extractBinaryFormData;
