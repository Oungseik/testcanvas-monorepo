# Test Canvas

A Monorepo of TestCanvas re-implementation.

---

## Design choices

Based on my many failed atempts to redesign and refactor the TestCanvas, I decided to come with new architecture. 

> [!Question] Is this aim for the cloud version or in a local use?
> We are planing to use it in the local environment, mainly serve for  an organization of a company.
> So we are not going to plan to scale for millions.

> [!Question]  How many users will use and devices will attach on average, and at most?
> For a company, or organization, we guess there might be 100 users and 200 devices at most. 
> Since, it is highly real-time and event driven, we planned to use socket.io as the primary way of communication, in order to avoid repetitive network connections. 
> (Socket.io claimed that it can support 10,000 concurrent connections easily.)

--- 

## Development experience related question


> [!Question] Why monorepo?
> Development process contains building, linting, formatting, testing processes. These tasks are needed to run frequently and take longer as the project grow. 
> We use monorepo to cache the time consuming tasks, to run only necessary.
> The second thing is that we want to share the types between packages. By doing this, if the backend developer changed something, the frontend developer will
> notice immediately.

> [!Question] Why socket.io, and not something like tRPC?
> tRPC is a good tool for end-to-end type safety. But it contains a lot complex types, so the editor slow down as the project grow.
> On other hand, socket.io have a way to define client to server and server to client event map, which is just normal interface.

---
