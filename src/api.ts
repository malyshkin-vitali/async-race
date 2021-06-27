const base: string = 'http://localhost:3000'


const garage: string = `${base}/garage`;
const engine: string = `${base}/engine`;
const winners: string = `${base}/winners`;


export const getCarsAll = async (): Promise<{count: string, items: any}> => {
    const response: Response = await fetch(`${garage}`);

    return {
        items: await response.json(),
        count: response.headers.get('X-Total-Count')
    };
}

export const getCar = async (id: string): Promise<any> => (await fetch(`${garage}/${id}`)).json();

export const createCar = async (body: {name: string, color: string}): Promise<any> => (await fetch(garage, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
        'Content-type': 'application/json'
    },
})).json();


export const deleteCar = async (id: number): Promise<any> => ((await fetch(`${garage}/${String(id)}`, {
    method: 'DELETE', headers: {
        'Access-Control-Allow-Origin': 'https://localhost:30000/'
    }
})).json());

export const updateCar = async (id: string, body: {name: string, color: string}): Promise<any> => (await fetch(`${garage}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
        'Content-type': 'application/json'
    },
})).json();

export const startEngine = async (id: string): Promise<any> => (await fetch(`${engine}?id=${id}&status=started`)).json();

export const stopEngine = async (id: string): Promise<any> => (await fetch(`${engine}?id=${id}&status=stopped`)).json();

export const drive = async (id: string): Promise<any> => {
    const res = await fetch(`${engine}?id=${id}&status=drive`).catch();
    return res.status !== 200 ? {success: false} : {...(await res.json())};
}




