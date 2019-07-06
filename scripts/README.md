This set helps you to handle Engarde as a service and aim to make it really easy to start using Engarde.

systemd configuration files just start /usr/bin/engarde-{client||server} passing /etc/engarde/{configuration_name}.yml

so usage is simple, eg:

systemctl start engarde-client@configurationName

if you have a file named /etc/engarde/configurationName.yml

I also did a little hacky script named engarde-enable to run before the actual engarde-client in systemd configuration file.

It also reads /etc/engarde/{configuration_name}.yml and, if you add a field named "autoChangeWgEndpoint" and set it to your wg interface (eg wg0) it will change for you your actual server endpoint to be your local Engarde endpoint, so that Engarde will start working immediately without any intervention. It will NOT change your saved WireGuard configuration of course, so if you stop Engarde and restart WireGuard (eg. systemctl restart wg-quick@wg0) your configuration will be restored. If you want Engarde endpoint activation to be permanent into your WireGuard configuration, you should update it accordingly.




