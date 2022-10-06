const reducer = (state = {}, action) => {
    switch (action.type) {
            case 'LOADING':
            return{ ...state,loading:true};
            case 'DO_LOGIN_STEP2_RESPONSE':
            return { ...state, content: action.json, loading: false };   
            default: 
            return state; 
       }  
   };
   export default reducer;