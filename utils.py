import socket

def get_local_ip():

    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)        # opens a UDP socket

    try:
        s.connect(("8.8.8.8" , 80))     # just to set up routing 
        local_ip = s.getsockname()[0]   # getsockname() -> returns a tuple containing the IP and PORT , [0] is the IP
    except:
        local_ip = "127.0.0.1"
    finally:
        s.close()

    return local_ip

# OLD Approach which breaks on docker container 
    # hostname = socket.gethostname()
    # local_ip = socket.gethostbyname(hostname)
    # print(local_ip)
    # return local_ip
