// ref: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
const postData = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    // console.log(response)
    return response.json()
}

const thousands_separator = (num) => {
    if (typeof(num) !== 'number') {
        try {
            return (thousands_separator(parseInt(num)))
        } catch (e) {
            return num
        }
    } else {
        var num_parts = num.toString().split(".");
        num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return num_parts.join(".");
    }
}

const capitalize = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const formatTimestamp = (timestamp, type='time') => {
    const ms = Date.parse(timestamp)
    const date = new Date(ms)
    switch (type) {
        case 'time': return date.toLocaleString()
        case 'date': {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString(undefined, options)
        }
        default: return timestamp
    }
}

export {postData, thousands_separator, capitalize,
        numberWithCommas, formatTimestamp}
