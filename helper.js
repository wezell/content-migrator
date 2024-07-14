

export async function httpsPost({ body, ...options }) {
    return httpsX({ body, ...options, method: 'POST' });
}
export async function httpsX({ body, ...options }) {
    let jsonData;
    let method = options.method || 'POST';
    let data = typeof body === 'string' ? body : JSON.stringify(body);
    let headers = options.headers;
    let hostname = options.hostname.indexOf('//') > -1
        ? options.hostname
        : "https://" + options.hostname;
    headers['Content-Length'] = data.length;
    headers['Content-Type'] = 'application/json';


    //console.log("fetching: " + `${hostname}${options.path}`)
    //console.log("data: " + data)
    //console.log("headers: " + JSON.stringify(headers))  
    await fetch(`${hostname}${options.path}`, {
        method: method,
        body: data,
        headers: headers,
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            return Promise.reject(response);


        })
        .then((json) => {

            jsonData = json;
        })
        .catch((response) => {
            console.log(response.status, response.statusText);
            response.json().then((json) => {
                console.log(json);
            })
            throw new Error('Error in fetch: ' + response.status + ' ' + response.statusText);  
        });

    return jsonData;


}