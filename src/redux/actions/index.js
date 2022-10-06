export const LoginStep2 = (obj) => (
    {
        type: 'LOADING',
        phone:obj.phone,
        password:obj.password,
        action : obj.action
    }
);