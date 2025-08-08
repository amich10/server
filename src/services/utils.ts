const generateRandomInstituteNumber = () => {
  return Math.floor(10000 + Math.random() * 90000);
};

export default generateRandomInstituteNumber;

// current time stamps can be used for better uniqueness.
