

class physicalBody:
    def __init__(self, name, position, velocity, mass, charge):
        self.name = name
        self.position = position
        self.velocity = velocity
        self.mass = mass
        self.charge = charge
    
    def move(self, time)