package a.b;

import c.d;

public function testInvokePkgFunctionInMixOrder() (int, float, string, int, string, int[]) {
    return d:functionWithAllTypesParams(10, e="Bob", 20.0, c="Alex", 40, 50, d=30, 60);
}

public function testInvokePkgFunctionWithRequiredArgsOnly() (int, float, string, int, string, int[]) {
    return d:functionWithAllTypesParams(10, 20.0);
}
