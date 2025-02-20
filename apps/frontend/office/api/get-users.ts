'server only'

export async function fetchUsers() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    return response.json();
}

