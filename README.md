# Build a RESTful API

A little project to understand what's a RESTful API and how to build it
 with Node.js.

## What is a RESTful API?

REST is undestood as REspresentational State Tranfer.

In simple terms it is a simple way to exchange information regardless of the 
graphic part.

There are 6 key constraints to think about when considering whether a RESTful 
API is the right type of API for your needs:

* Client-Server: This constraint operates on the concept that the client and the 
server should be separate from each other and allowed to evolve individually.

* Stateless: REST APIs are stateless, meaning that calls can be made independently 
of one another, and each call contains all of the data necessary to complete 
itself successfully.

* Cache: Because a stateless API can increase request overhead by handling large 
loads of incoming and outbound calls, a REST API should be designed to encourage 
the storage of cacheable data.

* Uniform Interface: The key to the decoupling client from server is having a uniform 
interface that allows independent evolution of the application without having the 
application’s services, or models and actions, tightly coupled to the API layer itself.

* Layered System: REST APIs have different layers of their architecture working 
together to build a hierarchy that helps create a more scalable and modular 
application.

* Code on Demand: Code on Demand allows for code or applets to be transmitted via 
the API for use within the application.