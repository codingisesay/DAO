const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    console.log("##### Date :-", date);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };