# engarde - Don't lose that packet!

[Official Facebook page](https://www.facebook.com/engarde-Dont-lose-that-packet-110039227317920)

## What is engarde?
engarde is a network utility specifically designed to create a point-to-point tunnel over multiple network (typically Internet) connections, ensuring that the tunnel stays up and healty without a single delay or package loss, as long as at least one of the connections is working.

## How is it possible?
engarde relies on the encryption and the de-duplication technology of the underlying WireGuard connection. It takes every UDP packet that is emitted by WireGuard and sends it through every avaliable connection. So, the first package that reaches its destination wins, and the others are silently discarded by WireGuard itself. In the same way, every response packet is sent to all the connected sockets, reaching the origin through all the connections.

## Doesn't WireGuard already support roaming between different connections?
It does, it's awesome and it's one of the things engarde relies on. WireGuard, however, sends its UDP packets over the default system interface for a specific route, usually the one used to access the Internet. If this interface goes down or loses access to the network, it's up to the operating system to detect it and change the routing table accordingly - and it doesn't always do it right.

## So, is it a failover/bonding connection mechanism?
In some way, engarde is similar to a failover mechanism, but it doesn't switch the connection when a problem occurs: this would inevitably lead to a delay in the transmission. Instead, engarde constantly sends every single packet through all the available connections: if one of the links has problems, the packet will still fastly reach its destination through the other ones, and the user won't even notice it. It's what some commercial solutions call "Redundant Mode" bonding. Moreover, failover technologies often rely on expensive hardware and hard configurations: engarde, on the other side, is totally open source and really simple to configure.

## Wait... isn't this a terrible bandwidth waste?
Absolutely yes. The used bandwidth is the one you would normally use multiplied by the number of the connections you have. But hey, imagine you are transmitting real time audio to a national radio station: would you really prefer that a connection failure causes some moments of silence to the listeners, or would you happily waste your bandwidth to avoid it?

## How do I get it?
You can find the latest builds here (thanks to linuxzogno.org for hosting them):

### Server
|                   | i386     | amd64    | arm    |
| ----------------- | -------- | -------- | -------- |
| *Linux*           | [Download](https://engarde.linuxzogno.org/builds/master/linux/i386/engarde-server) | [Download](https://engarde.linuxzogno.org/builds/master/linux/amd64/engarde-server) | [Download](https://engarde.linuxzogno.org/builds/master/linux/arm/engarde-server) |
| *Windows*         | [Download](https://engarde.linuxzogno.org/builds/master/windows/i386/engarde-server.exe) | [Download](https://engarde.linuxzogno.org/builds/master/windows/amd64/engarde-server.exe) |  |
| *Darwin (Mac OS)* | [Download](https://engarde.linuxzogno.org/builds/master/darwin/i386/engarde-server) | [Download](https://engarde.linuxzogno.org/builds/master/darwin/amd64/engarde-server) |  |

### Client
|                   | i386     | amd64    | arm    |
| ----------------- | -------- | -------- | -------- |
| *Linux*           | [Download](https://engarde.linuxzogno.org/builds/master/linux/i386/engarde-client) | [Download](https://engarde.linuxzogno.org/builds/master/linux/amd64/engarde-client) | [Download](https://engarde.linuxzogno.org/builds/master/linux/arm/engarde-client) |
| *Windows*         | [Download](https://engarde.linuxzogno.org/builds/master/windows/i386/engarde-client.exe) | [Download](https://engarde.linuxzogno.org/builds/master/windows/amd64/engarde-client.exe) |  |
| *Darwin (Mac OS)* | [Download](https://engarde.linuxzogno.org/builds/master/darwin/i386/engarde-client) | [Download](https://engarde.linuxzogno.org/builds/master/darwin/amd64/engarde-client) |  |

If you prefer, or if you need another architecture, you can always compile from source. Some more documentation about this will be available soon, but it shouldn't be too hard if you know a little about Golang.

## How do I use it?

### Scenario 1: multiple connections on one peer, single stable connection on the other
This is the most typical scenario: you have a reliable server on one end, and a client with multiple unstable connections (maybe in mobility).

![Scenario 1](https://engarde.linuxzogno.org/Scenario1.png)

So, we need to establish a reliable connection between our laptop and the server, but none of the connections we have on the laptop is reliable enough. We can, howerver, assume that at least one of them will work in every moment.

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

3. Download engarde-server (see the *How do I get it?* section). Launch it passing the config file path as the first and only parameter: if nothing is passed, engarde will look for an `engarde.yml` file in the current directory.

4. Follow the same procedure of step 3 for the client, using engarde-client instead of engarde-server.

5. Change the WireGuard configuration on the client: set the peer address to the engarde-client listen address (in this procedure, it will be 127.0.0.1:59401). You don't need to change anything on the server.

Done! engarde is now overlying your WireGuard tunnel: try to ping the server from the client (on the WireGuard IP address 192.168.5.1) and, while doing so, disconnect an interface or even physically detach it: the traffic will continue to flow normally, without any delay, until at least one interface is working. If there are no interfaces available at a given moment, the traffic will stop, but will be immediately resumed whenever one of them will be available again.

### Scenario 2: multiple connections between two peers
Here we have a totally different scenario: we are in a data center, and two servers are connected with two Ethernet cables that follow different paths for redundancy.

![Scenario 2](https://engarde.linuxzogno.org/Scenario2.png)

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

## How can I check if everything is working?
There is an Angular web interface embedded in both the client and the server. Please have a look to the comments in the [example config file](https://github.com/porech/engarde/blob/master/engarde.yml.sample) for more information about how to enable it.

In the client, it shows the interfaces that are currently sending data and, for each of them, the last time a packet was received from the server on it. If an interface isn't receiving data from the server, while the other are, it's probably faulty. If all of them are not receiving data, it's probably because there's no traffic on the tunnel.  
You can also exclude an interface on-the-go, but keep in mind that those changes are temporary and they're lost when the client is restarted. To make them permanent, you need to edit the configuration file.

The server interface is pretty much the same, but instead of the interfaces it shows the addresses it's currently receiving (and sending) data on.

## It's useless! It's a bad copy of {some-other-software}
Honestly, we are quite lazy people, and before coding something we always look for an existing solution that would suit our needings. This time, we really couldn't find one. If you know something similar, please, PLEASE open an issue with title "engarde is a bad copy of ...", we'd love to know that!

## Does it require root?
engarde can be run without any administrative privileges, but many users reported that engarde-client doesn't create any socket on Linux if executed as a non-root user.  
To solve that, you need to move the executable file in a folder that is not mounted with the `nosuid` option (so, don't keep it in your home but move it, for example, to /usr/bin). Then, run as root `setcap cap_net_raw+ep /path/to/engarde-client`.  
After doing this, you'll be able to run engarde-client as a normal user.

## Can I ask for help?
Of course! Feel free to open an issue for any necessity ;)

## I love it, can I offer you a coffee?
Wow, thanks! You can drop some Bitcoin to 39fBEZvKvxf2aZUBWWV1PuoKwCUvk6VWLg

## Are you still developing it? (aka: project status)
To answer this question, I will rapidly start with why I wrote engarde.

I cooperate with a radio station, and sometimes we need to transmit from out-of-the-world locations with a reasonable latency. We use little bandwidth (a 64kbps OPUS stream is enough in a difficult situation), but of course we need the connection not to drop or listeners are not happy. We mainly rely on 4G connections, that work like a charm most of the time but sometimes they get down. So, we have a bunch of them from different carriers and we use engarde to reach our central server. Sometimes, additional connections pop up, even in the middle of a live session: a wifi offered by a gentleman who lives there, or something like that.

That's an easy setup: one client, one server and many connections. As it is now, engarde perfectly fits this use case.

So, I'm still ensuring that engarde compiles and works correctly, as I use it myself, but I'm not really motivated into further improving it because I don't need anything more from it. Not a good way of thinking as an open source project mantainer, I know, but I started new projects such as having a baby and some social life, and they're quite time-consuming.

I think engarde has a lot of potential in other fields, and those are the things I would do if I had time (from the simpler to the harder):
1. Re-organize all code that I wrote years ago when I didn't know how to do that, it's quite a mess
2. Have a single executable for both client and server, and let the configuration decide what to start as
3. Allow to have a single instance host multiple configurations, instead of having to start a process for each client on the server
4. Avoid overlaying Wireguard but use an userspace implementation of Wireguard that directly creates the VPN. This would probably allow to differentiate the connecting clients and avoid using a separate port for each client
5. Make it a software and not a hack: something that can be installed with a package and configured easily. I look at the Tailscale setup and usage experience and I see what I'd love engarde to be

I'll probably never make all of this, but if you think engarde deserves some care and are willing to contribute, this is what I think is useful to do. I'd love it!

## It would be better in Rust!
There is [a porting](https://github.com/hanleym/rengarde) in progress! Thank you [hanleym](https://github.com/hanleym).

## License

### Source code
The whole source code is released under the terms of the GNU General Public License (GPL) v2. You can find a copy of the license in the LICENSE.txt file.  

### Logo
The engarde logo is based on the Go gopher. The Go gopher was designed by Renee French. (http://reneefrench.blogspot.com/)
The design is licensed under the Creative Commons 3.0 Attributions license.
Read this article for more details: https://blog.golang.org/gopher
