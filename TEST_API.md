# Quick Test Commands

## 1. Restart Backend (Required after config clear)
```bash
cd backend
# Press Ctrl+C to stop current server
php artisan serve
```

## 2. Test in Browser Console
Open http://localhost:5173/dashboard/two, press F12, paste:

```javascript
async function testPollAPI() {
    try {
        console.log('🧪 Testing POST /api/polls...');
        
        const response = await fetch('http://localhost:8000/api/polls', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: 'Test Poll',
                candidates: [
                    { name: 'Candidate A', description: 'Description A' },
                    { name: 'Candidate B', description: 'Description B' }
                ]
            })
        });

        console.log('📊 Status:', response.status);
        console.log('📊 Status Text:', response.statusText);
        
        const contentType = response.headers.get('content-type');
        console.log('📊 Content-Type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('✅ JSON Response:', data);
            
            if (data.poll) {
                console.log('🎉 SUCCESS! Poll ID:', data.poll.id);
            } else if (data.error) {
                console.error('❌ Error:', data.error);
            }
        } else {
            const text = await response.text();
            console.error('❌ HTML Response (not JSON):', text.substring(0, 500));
        }
        
    } catch (error) {
        console.error('❌ Network Error:', error);
    }
}

testPollAPI();
```

## 3. Expected Results

### If Success:
```
✅ JSON Response: {message: "Poll created successfully", poll: {id: 1, ...}}
🎉 SUCCESS! Poll ID: 1
```

### If Error:
Will show exact error message from backend

## 4. Check Database After Success
```bash
docker exec quickvote_mysql mysql -uroot -psecret quickvote -e "SELECT * FROM polls;"
docker exec quickvote_mysql mysql -uroot -psecret quickvote -e "SELECT * FROM candidates;"
```

## 5. Common Errors:

### "SQLSTATE[HY000] [2002] Connection refused"
- MySQL container not running
- Fix: `docker-compose up -d`

### "SQLSTATE[42S02]: Base table or view not found"
- Tables not created
- Fix: `php artisan migrate`

### "419 Page Expired" or CSRF error  
- CORS issue
- Already fixed in routes (public route)

### HTML Error Page
- PHP error in controller
- Check backend terminal for stack trace
