import React from 'react'

function UserDetails() {
     useEffect(() => {
            const fetchUser = async () => {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/users`);
                    setUser(response.data);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchUser();
        }, []);
  return (
    <div>UserDetails</div>
  )
}

export default UserDetails