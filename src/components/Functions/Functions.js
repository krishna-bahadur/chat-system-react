export const getTimeFromDateTime = (dateTime) =>{
    if(dateTime){
      let parsedDate = new Date(dateTime);
      let time = parsedDate.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
      return time;
    }
    return null;
  }