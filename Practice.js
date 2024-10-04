var a=pm.response.code;
console.log(a);

var b=pm.response.status;
console.log(b);

var c=pm.response.responseTime;
console.log(c);

var d=pm.response.size();
console.log(d)
console.log(d.body);
console.log(d.header);

var e=pm.response.json();
var f=e.id;
console.log(f);


var g=pm.response.json();

console.log(g.cust_fName);

var head=pm.response.headers.get("Content-Type");
console.log(head);

var head1=pm.response.headers.get("Date");
console.log(head1);


pm.test("test cases for status code : " ,function(){
    pm.expect(pm.response.code).to.be.equal(200);
});

pm.test("test case for status line : ", function(){
    pm.expect(pm.response.status).to.be.equal("OK");
});


pm.test("test case for responseTime Should be below 2 seconds",function(){
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("test case for respnse size for body : header : total",function(){
    pm.expect(pm.response.size().body).to.be.below(1000);
    pm.expect(pm.response.size().header).to.be.below(500);
    pm.expect(pm.response.size().total).to.be.below(1500);
});


pm.test("for header",function(){
     pm.expect(pm.response.size().header).to.be.below(500);
});

pm.test("for Total",function(){
     pm.expect(pm.response.size().total).to.be.below(1500);
});

pm.test("for body",function(){
     pm.expect(pm.response.size().body).to.be.below(1000);
});



pm.test("test case for mobile",function(){
   pm.expect(pm.response.json().phone).to.be.contain(123);
});

pm.test("test case for email",function(){
    pm.expect(pm.response.json().email).to.be.include("@gmail.com")
})

pm.test("test case for content-Type",function(){
    pm.expect(pm.response.headers.get("Content-Type")).to.be.eql("application/json");
})

pm.test("test case for date : ",function(){
    pm.expect(pm.response.headers.get("Date")).to.be.include("Oct 2024");
});








