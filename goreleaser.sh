docker run --rm --privileged \
  -v $PWD:/go/src/github.com/mereithhh/van-nav \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -w /go/src/github.com/mereithhh/van-nav \
  gohornet/goreleaser-cgo-cross-compiler:latest goreleaser --snapshot --rm-dist