//jshint esversion:6

exports.getDate = function (){
  const options = { weekday: 'long',
                  month: 'long',
                  day: 'numeric' };

  const today = new Date();
  return today.toLocaleDateString("en-ES",options);
};

exports.getDay = function (){
  const options = { weekday: 'long' };

  const today = new Date();
  return today.toLocaleDateString("en-ES",options);
}
