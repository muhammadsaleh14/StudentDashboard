from django.db import models

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name
    
class Student(models.Model):
    image = models.ImageField(upload_to='student_images/', null=True, blank=True)  # New image field
    name = models.CharField(max_length=100)
    cnic = models.CharField(max_length=15, unique=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)  # Foreign key to Department
    date_of_birth = models.DateField()

    def __str__(self):
        return self.name



class Course(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True)

    def __str__(self):
        return self.name

class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('student', 'course')

class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    status = models.BooleanField()  # True for present, False for absent

    class Meta:
        unique_together = ('student', 'course', 'date')

class Grade(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    grade = models.FloatField()

    class Meta:
        unique_together = ('student', 'course')

