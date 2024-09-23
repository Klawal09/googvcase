import https from 'https';

// Use environment variables instead of hardcoding credentials
const SALESFORCE_CLIENT_ID = process.env.SALESFORCE_CLIENT_ID || '3MVG9XgkMlifdwVAHohJYTnzLbQEMcmepssHDYItbSfz5H37d4CGyVg9QD9ruAl3FCNq345bXFbFgEnB2.jJU';
const SALESFORCE_CLIENT_SECRET = process.env.SALESFORCE_CLIENT_SECRET || 'CF8CB5BD7019F013E5F52C161822725D2B9E0564F0EE1FB46D0F0043144802D1';
const SALESFORCE_USERNAME = process.env.SALESFORCE_USERNAME || 'kevinlawal@mindful-shark-6v7dar.com';
const SALESFORCE_PASSWORD = process.env.SALESFORCE_PASSWORD || 'Football09!' + process.env.SALESFORCE_SECURITY_TOKEN || 'hMiY8SJYwzVCi3mGsDzYN27L';

export const handler = async (event) => {
    console.log('Starting authentication with Salesforce...');
    
    // Log the incoming event for debugging
    console.log('Received event:', JSON.stringify(event));

    // Extract intent and case ID if they exist
    const intent = event?.request?.intent?.name;
    const caseNumber = event?.request?.intent?.slots?.caseNumber?.value; // Adjust based on your slot structure
    console.log("Received intent:", intent);
    console.log("Case Number:", caseNumber);

    const authParams = new URLSearchParams({
        grant_type: 'password',
        client_id: SALESFORCE_CLIENT_ID,
        client_secret: SALESFORCE_CLIENT_SECRET,
        username: SALESFORCE_USERNAME,
        password: SALESFORCE_PASSWORD,
    });

    const options = {
        hostname: 'login.salesforce.com',
        path: '/services/oauth2/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(authParams.toString()),
        },
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const response = JSON.parse(data);
                if (res.statusCode === 200) {
                    console.log('Authentication successful:', response);
                    resolve({
                        statusCode: 200,
                        body: JSON.stringify({
                            message: 'Authentication successful',
                            authResponse: response,
                        }),
                    });
                } else {
                    console.error('Error during authentication:', response);
                    reject(new Error(`Failed to authenticate with Salesforce: ${JSON.stringify(response)}`));
                }
            });
        });

        req.on('error', (e) => {
            console.error('Request error:', e);
            reject(e);
        });

        req.write(authParams.toString());
        req.end();
    });
};
