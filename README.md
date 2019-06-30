# engarde - Don't loose that packet!

## What is engarde?
engarde is a network utility specifically designed to create a point-to-point tunnel over multiple network (tipically Internet) connections, ensuring that the tunnel stays up and healty without a single delay or package loss, as long as at least one of the connections is working.

## How is it possible?
engarde relies on the encryption and the de-duplication technology of the underlying WireGuard connection. It takes every UDP packet that is emitted by WireGuard and sends it through every avaliable connection. So, the first package that reaches its destination wins, and the others are silently discarded by WireGuard itself. In the same way, every response packet is sent to all the connected sockets, reaching the origin through all the connections.

## Doesn't WireGuard already support roaming between different connections?
It does, it's awesome and it's one of the things engarde relies on. WireGuard, however, sends its UDP packets over the default system interface for a specific route, usually the one used to access the system. If this interface goes down or looses access to the network, it's up to the operating system to detect it and change the routing table accordingly - and it doesn't always do it right.

## So, is it a failover connection mechanism?
In some way, engarde is similar to a failover mechanism, but it doesn't switch the connection when a problem occurs: this would inevitably lead to a delay in the transmission. Instead, engarde constantly sends every single packet through all the available connections: if one of the links has problems, the packet will still fastly reach its destination through the other ones, and the user won't even notice it. Moreover, failover technologies often rely on expensive hardware and hard configurations: engarde, on the other side, is totally open source and really simple to configure.

## Wait... isn't this a terrible bandwidth waste?
Absolutely yes. The used bandwidth is the one you would normally use multiplied by the number of the connections you have. But hey, imagine you are transmitting real time audio to a national radio station: would you really prefer that a connection failure causes some moments of silence to the listeners, or would you happily waste your bandwidth to avoid it?

## How do I use it?

### Scenario 1: multiple connections on one peer, single stable connection on the other
This is the most typical scenario: you have a reliable server on one end, and a client with multiple unstable connections (maybe in mobility).

![Scenario 1](http://i65.tinypic.com/2me4snm.png)

So, we need to establish a reliable connection between our laptop on the truck and the super server, but none of the connections we have on the truck is reliable enough. We can, howerver, assume that at least one of them will work in every moment.

1. First of all, set up a WireGuard tunnel between the two peers, following the [official quick start](https://www.wireguard.com/quickstart/). You need to specify a static listen port on the server (59301 is assumed in this procedure) and set the correct peer endpoint on the client. The opposite is not necessary: WireGuard will use a random listen port on the client, and the server will memorize it along with the source address when it first receives a packet. At the end, both the laptop and the server should have a WireGuard IP: in this procedure we'll assume that the server has IP 192.168.5.1, and the laptop has 192.168.5.2, but it can be whatever you want. Test the two systems can ping each other on the WireGuard IP before proceeding to step 2.

2. Prepare the engarde configuration file: the engarde.yml.sample is well commented and will guide you. For this procedure, we will use the configuration:
```
client:
  listenAddr: "127.0.0.1:59401"
  dstAddr: "198.51.100.32:59402"
  excludedInterfaces:
    - "eth3"
    - "wg0"

server:
  listenAddr: "0.0.0.0:59402"
  dstAddr: "127.0.0.1:59301"
```

Have a particular look at excludedInterfaces, its usage is well documented in the sample file comments. Don't forget to exclude the WireGuard interface itself, or it can cause a weird loop.

Take the file and copy it to the client and to the server. You can omit the client portion on the server and vice-versa, or leave both: the unuseful portion will just be ignored.

3. Download engarde-server from the dist/your-platform folder of this project, or build it from the Go source. Detailed instructions about building be avaliable soon, but it should't be too hard if you know Go a little. Launch it passing the config file path as the first argument: if nothing is passed, engarde will look for an `engarde.yml` file in the current directory.

4. Follow the same procedure of step 3 for the client, using engarde-client instead of engarde-server.

5. Change the WireGuard configuration on the client: set the peer address to the engarde-client listen address (in this procedure, it will be 127.0.0.1:59401). You don't need to change anything on the server.

Done! engarde is now overlying your WireGuard tunnel: try to ping the server from the client (on the WireGuard IP address 192.168.5.1) and, while doing so, disconnect an interface or even physically detach it: the traffic will continue to flow normally, without any delay, until at least one interface is working. If there are no interfaces available at a given moment, the traffic will stop, but will be immediately resumed whenever one of them will be available again.

### Scenario 2: multiple connections between two peers
Here we have a totally different scenario: we are in a data center, and two servers are connected with two Ethernet cables that follow different paths for redundancy.

![Scenario 2](http://i65.tinypic.com/15dhn5.png)

The procedure to follow is identical to the first scenario, but with a small change in the configuration file:
```
client:
  listenAddr: "127.0.0.1:59401"
  dstAddr: "192.168.1.2:59402"
  dstOverrides:
    - ifName: "eth1"
      dstAddr: "192.168.2.2:59402"

server:
  listenAddr: "0.0.0.0:59402"
  dstAddr: "127.0.0.1:59301"
```

That's it: engarde client will use 192.168.1.2 as destination, except for eth1 where 192.168.2.2 is used. You will just need to use the WireGuard IPs to communicate between the two servers: the packets will always find their way to the destination.

### Other scenarios
There are a lot of other situations where engarde can make the difference: the connection doesn't have to be a point-to-point one, an entire network can be routed through a tunnel. Virtually, engarde can work in every situation where WireGuard can. For now, if you need to connect different clients to a single server you need to run a different instance of engarde-server, with the same dstAddr and different listen ports, and configure each client to talk with a different port.  
We're looking into the possibility of making engarde inspect WireGuard handshakes to differentiate the clients, but it's still a work in progress.

## It's useless! It's a bad copy of {some-other-software}
Honestly, we are quite lazy people, and before coding something we always look for an existing solution that would suit our needings. This time, we really couldn't find one. If you know something similar, please, PLEASE open an issue with title "engarde is a bad copy of ...", we'd love to know that!

## Can I ask for help?
Of course! Feel free to open an issue for any necessity ;)